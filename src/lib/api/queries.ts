// React Query hooks: backend data with graceful fallback to the sample data.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  mockEmails,
  mockMeetings,
  mockKnowledge,
  mockPeople,
  mockUser,
  homeNeedToKnow,
  homeSuggestions,
  type MockEmail,
  type MockMeeting,
  type Person,
} from "@/lib/mock-data";
import { req, withFallback } from "./client";
import { toKnowledgeRecord, toMockEmail, toMockMeeting, toPerson, relTime } from "./mappers";
import type {
  ApiMeeting,
  ApiUserProfile,
  DailyBrief,
  EmailView,
  KnowledgeProfile,
  PersonView,
  TodoView,
} from "./types";

export function useEmails() {
  return useQuery<MockEmail[]>({
    queryKey: ["emails"],
    queryFn: () =>
      withFallback(
        async () => (await req<EmailView[]>("/api/emails")).map(toMockEmail),
        mockEmails,
      ),
  });
}

export function useKnowledgeProfile() {
  return useQuery<Record<string, string[]>>({
    queryKey: ["knowledge-profile"],
    queryFn: () =>
      withFallback(
        async () => toKnowledgeRecord(await req<KnowledgeProfile>("/api/knowledge/profile")),
        mockKnowledge,
      ),
  });
}

export function usePeople() {
  return useQuery<Person[]>({
    queryKey: ["people"],
    queryFn: () =>
      withFallback(
        async () => (await req<PersonView[]>("/api/people")).map(toPerson),
        mockPeople,
      ),
  });
}

export function useMeetings() {
  return useQuery<MockMeeting[]>({
    queryKey: ["meetings"],
    queryFn: () =>
      withFallback(
        async () => (await req<ApiMeeting[]>("/api/meetings")).map(toMockMeeting),
        mockMeetings,
      ),
  });
}

export interface HomeBrief {
  needToKnow: { id: string; text: string; time: string }[];
  suggestions: string[];
  needsAttention: number;
}

const fallbackBrief: HomeBrief = {
  needToKnow: homeNeedToKnow,
  suggestions: homeSuggestions,
  needsAttention: mockEmails.filter((e) => e.needsReply).length,
};

export function useBrief() {
  return useQuery<HomeBrief>({
    queryKey: ["brief"],
    queryFn: () =>
      withFallback(async () => {
        const brief = await req<DailyBrief>("/api/agent/brief");
        return {
          needToKnow: brief.top_priority.slice(0, 3).map((t) => ({
            id: t.email_id,
            text: t.summary,
            time: t.priority,
          })),
          suggestions: brief.suggested_actions,
          needsAttention: brief.need_reply.length,
        };
      }, fallbackBrief),
    retry: false, // 404 until the first triage run — fall back quietly
  });
}

export function useUserName() {
  return useQuery<string>({
    queryKey: ["profile-name"],
    queryFn: () =>
      withFallback(async () => (await req<ApiUserProfile>("/api/profile")).name, mockUser.name),
  });
}

export interface EmailTodo {
  id: string;
  text: string;
  context: string;
  deadline?: string;
  time?: string;
}

export function useEmailTodos() {
  return useQuery<EmailTodo[]>({
    queryKey: ["todos"],
    queryFn: () =>
      withFallback(
        async () =>
          (await req<TodoView[]>("/api/todos"))
            .filter((t) => t.source === "email")
            .map((t) => ({
              id: t.id,
              text: t.text,
              context: t.context,
              deadline: t.deadline ?? undefined,
              time: t.created_at ? relTime(t.created_at) : undefined,
            })),
        [],
      ),
  });
}

export interface CalendarMeeting {
  id: string;
  title: string;
  date: Date;
  time: string;
}

// Mock fallback keeps the calendar demo dates the page shipped with.
const MOCK_CAL_OFFSETS = [0, 1, 3];
const MOCK_CAL_TIMES = ["2:00 PM", "11:30 AM", "4:00 PM"];

function mockCalendarMeetings(): CalendarMeeting[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return mockMeetings.map((m, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + (MOCK_CAL_OFFSETS[i] ?? i));
    return { id: m.id, title: m.title, date: d, time: MOCK_CAL_TIMES[i] ?? "10:00 AM" };
  });
}

export function useCalendarMeetings() {
  return useQuery<CalendarMeeting[]>({
    queryKey: ["calendar-meetings"],
    queryFn: () =>
      withFallback(
        async () =>
          (await req<ApiMeeting[]>("/api/meetings")).map((m) => {
            const d = new Date(m.starts_at);
            return {
              id: m.id,
              title: m.title,
              date: d,
              time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            };
          }),
        mockCalendarMeetings(),
      ),
  });
}

/** Route-loader helper (not a hook): person by id, backend first, mock fallback. */
export async function fetchPerson(personId: string): Promise<Person | null> {
  try {
    return toPerson(await req<PersonView>(`/api/people/${personId}`));
  } catch {
    return mockPeople.find((p) => p.id === personId) ?? null;
  }
}

// ---- draft revise (conversational) + Gmail draft sync ----
export interface SuggestedRule {
  situation: string;
  preference: string;
  section?: string;
}

export interface ReviseResult {
  draft: { id: string; draft_body: string; subject_suggestion?: string | null };
  reply_text: string;
  suggested_rule?: SuggestedRule | null;
}

/** Send one revise message; returns the updated draft + agent ack + maybe a rule. */
export async function reviseDraft(draftId: string, message: string): Promise<ReviseResult> {
  return req<ReviseResult>(`/api/drafts/${draftId}/revise`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

/** Push the (edited) reply into the user's Gmail Drafts. Never sends. */
export async function pushDraftToGmail(
  draftId: string,
  body: string,
  subject?: string,
): Promise<{ gmail_draft_id?: string; synced: boolean; detail?: string }> {
  return req(`/api/drafts/${draftId}/push-to-gmail`, {
    method: "POST",
    body: JSON.stringify({ body, subject }),
  });
}

/** Kick off the agent loop, then refresh everything derived from it. */
export function useRunTriage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => req("/api/agent/run-triage", { method: "POST" }),
    onSuccess: () => {
      toast.success("Triage complete — drafts are ready to review");
      void qc.invalidateQueries();
    },
    onError: () => {
      toast.error("Backend offline — start it to run a real triage");
    },
  });
}

// ---- routines (proactive schedules) & nudges ----
export interface Routine {
  id: string;
  title: string;
  prompt: string;
  schedule: string;
  time: string;
  enabled: boolean;
  kind: string;
  created_from: string;
  last_run_at?: string | null;
}

export interface Nudge {
  id: string;
  routine_id: string;
  title: string;
  body: string;
  items: string[];
  created_at: string;
  read: boolean;
}

export function useRoutines() {
  return useQuery<Routine[]>({
    queryKey: ["routines"],
    queryFn: () => withFallback(() => req<Routine[]>("/api/routines"), []),
  });
}

export function useCreateRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (r: { title: string; prompt: string; time?: string; schedule?: string }) =>
      req<Routine>("/api/routines", { method: "POST", body: JSON.stringify(r) }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["routines"] }),
  });
}

export function useToggleRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      req<Routine>(`/api/routines/${id}`, { method: "PATCH", body: JSON.stringify({ enabled }) }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["routines"] }),
  });
}

export function useRunRoutineNow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => req<Nudge>(`/api/routines/${id}/run`, { method: "POST" }),
    onSuccess: () => {
      toast.success("Routine ran — result is on your Home page");
      void qc.invalidateQueries();
    },
  });
}

export function useNudges() {
  return useQuery<Nudge[]>({
    queryKey: ["nudges"],
    queryFn: () => withFallback(() => req<Nudge[]>("/api/nudges?unread_only=true"), []),
  });
}

// ---- backend health (integrations status) ----
export interface HealthInfo {
  status: string;
  llm_mode: string;
  llm_model?: string | null;
  email_provider: string;
  auto_send_enabled: boolean;
}

export function useHealth() {
  return useQuery<HealthInfo | null>({
    queryKey: ["health"],
    queryFn: () => withFallback(() => req<HealthInfo>("/api/health"), null),
  });
}

// ---- Ivy's specialist team ----
export interface Specialist {
  id: string;
  name: string;
  description: string;
  tools: string[];
  runs: number;
  created_at: string;
  last_used_at?: string | null;
  /** "system" for the built-in email/meeting/reminder agents, "custom" for user-created. */
  kind?: string;
  /** Human-facing name for system agents that graduate into "My Skills", e.g. "Email Employee". */
  display_name?: string | null;
  /** For system agents with a display_name: whether the underlying integration is actually linked. */
  connected?: boolean;
}

export function useSpecialists() {
  return useQuery<Specialist[]>({
    queryKey: ["specialists"],
    queryFn: () => withFallback(() => req<Specialist[]>("/api/specialists"), []),
  });
}

// ---- Ivy chat (supervisor agent) ----
export interface ChatEvent {
  kind: string;
  label: string;
}

export interface ChatReply {
  reply: string;
  events: ChatEvent[];
  conversation_id: string;
}

/** Send a message to Ivy; she plans, delegates to specialists, reviews, replies. */
export function useIvyChat() {
  return useMutation<ChatReply, Error, string>({
    mutationFn: (message: string) =>
      req<ChatReply>("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message, conversation_id: "home" }),
      }),
  });
}
