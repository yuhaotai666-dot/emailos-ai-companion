// Map backend responses onto the UI shapes the pages already render.
// Keeping the UI shapes untouched means the pages only swap their data source.
import type {
  Category,
  MockEmail,
  MockMeeting,
  Person,
  Priority,
  RelationshipType,
  PersonStatus,
  Confidence,
  SourceType,
} from "@/lib/mock-data";
import type { ApiMeeting, EmailView, KnowledgeProfile, PersonView } from "./types";

// ---- time helpers -----------------------------------------------------------
export function relTime(iso: string): string {
  const then = new Date(iso).getTime();
  const mins = Math.round((Date.now() - then) / 60000);
  if (Number.isNaN(mins)) return "";
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "1d ago" : `${days}d ago`;
}

function friendlyMeetingTime(iso: string): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(d);
  day.setHours(0, 0, 0, 0);
  const diff = Math.round((day.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return `Today · ${time}`;
  if (diff === 1) return `Tomorrow · ${time}`;
  return `${d.toLocaleDateString("en-US", { weekday: "short" })} · ${time}`;
}

// ---- emails -----------------------------------------------------------------
export function toMockEmail(e: EmailView): MockEmail {
  return {
    id: e.id,
    sender: e.sender_name,
    senderEmail: e.sender_email,
    subject: e.subject,
    summary: e.summary || e.body_preview,
    category: (e.category ?? "FYI") as Category,
    priority: ((e.priority ?? "Low").toLowerCase()) as Priority,
    suggestedAction: e.suggested_action ?? "",
    reason: e.why_it_matters ?? "",
    time: relTime(e.received_at),
    needsReply: e.needs_reply ?? false,
    draftPreview: e.draft_preview ?? undefined,
    draftBody: e.draft_body ?? undefined,
    confidence: e.confidence != null ? Math.round(e.confidence * 100) : undefined,
    filter: e.category ?? undefined,
    bodyPreview: e.body_preview || undefined,
    needsRetriage: e.needs_retriage ?? false,
    // Real classification present only when the backend sent a category and
    // the shown message isn't awaiting a re-triage.
    triaged: e.category != null && !(e.needs_retriage ?? false),
  };
}

// ---- knowledge --------------------------------------------------------------
export function toKnowledgeRecord(profile: KnowledgeProfile): Record<string, string[]> {
  const record: Record<string, string[]> = {};
  for (const s of profile.sections) record[s.title] = s.items;
  return record;
}

// ---- people -----------------------------------------------------------------
const KNOWN_RELATIONSHIPS = new Set<string>([
  "Creator Partner", "Influencer", "Internal Team", "Finance",
  "Product Access", "Sales Lead", "Customer", "Personal",
]);
const RELATIONSHIP_ALIASES: Record<string, RelationshipType> = {
  "Prospective Partner": "Sales Lead",
  Partner: "Creator Partner",
  Contact: "Customer",
};

function toRelationship(r: string): RelationshipType {
  if (KNOWN_RELATIONSHIPS.has(r)) return r as RelationshipType;
  return RELATIONSHIP_ALIASES[r] ?? "Customer";
}

export function toPerson(p: PersonView): Person {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    company: p.company,
    role: p.role || "—",
    channel: p.channel || "Email",
    relationship: toRelationship(p.relationship),
    status: p.status as PersonStatus,
    aiDescription: p.ai_description,
    whoTheyAre: p.who_they_are,
    relationshipContext: p.relationship_context,
    stage: p.stage,
    active: (p.active as Person["active"]) ?? "active",
    lastContacted: relTime(p.last_contacted),
    openThreads: p.open_threads,
    threads: p.threads.map((t) => ({
      subject: t.subject,
      snippet: t.snippet,
      needsReplyFrom: (t.needs_reply_from === "them" ? "them" : "you") as "you" | "them",
      suggestedNext: t.suggested_next,
    })),
    suggestedNextAction: p.suggested_next_action,
    communicationStyle: {
      tone: p.communication_tone,
      notes: p.communication_notes,
    },
    importantContext: p.important_context.map((c) => ({ label: c.label, value: c.value })),
    uncertainties: p.uncertainties,
    claims: p.claims.map((c) => ({
      text: c.text,
      sourceType: (["email", "meeting", "manual note"].includes(c.source_type)
        ? c.source_type
        : "email") as SourceType,
      observedDate: relTime(c.observed_date),
      confidence: c.confidence as Confidence,
    })),
  };
}

// ---- meetings ---------------------------------------------------------------
export function toMockMeeting(m: ApiMeeting): MockMeeting {
  // Meetings without a recap yet get a synthesized preview so the meetings and
  // todo pages stay functional; it's clearly draft content, nothing is sent.
  const followUp = m.follow_up ?? {
    recipients: [],
    subject: `Recap & next steps — ${m.title}`,
    summary: `Recap will be drafted after the meeting. Planned focus: ${m.prep}`,
    todos: m.action_items.map((task) => ({ owner: "Theo", task, due: undefined })),
  };
  return {
    id: m.id,
    title: m.title,
    time: friendlyMeetingTime(m.starts_at),
    attendees: m.attendees,
    prep: m.prep,
    questions: m.questions,
    actionItems: m.action_items,
    followUp: {
      generatedAt: m.follow_up ? "after the meeting" : "preview — meeting not held yet",
      recipients: followUp.recipients,
      subject: followUp.subject,
      summary: followUp.summary,
      todos: followUp.todos.map((t) => ({
        owner: t.owner,
        task: t.task,
        due: t.due ?? undefined,
      })),
    },
  };
}
