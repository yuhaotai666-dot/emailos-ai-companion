// Mirrors the backend Pydantic response models (snake_case, ISO datetimes).

export interface EmailView {
  id: string;
  thread_id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  body_preview: string;
  received_at: string;
  source: string;
  category?: string | null;
  priority?: string | null;
  needs_reply?: boolean | null;
  summary?: string | null;
  why_it_matters?: string | null;
  suggested_action?: string | null;
  deadline_if_any?: string | null;
  risk_if_ignored?: string | null;
  confidence?: number | null;
  draft_id?: string | null;
  draft_preview?: string | null;
  needs_retriage?: boolean;
}

export interface KnowledgeSection {
  title: string;
  items: string[];
}

export interface KnowledgeProfile {
  sections: KnowledgeSection[];
}

export interface PersonThread {
  subject: string;
  snippet: string;
  needs_reply_from: string;
  suggested_next: string;
}

export interface PersonClaim {
  text: string;
  source_type: string;
  observed_date: string;
  confidence: string;
}

export interface ImportantContext {
  label: string;
  value: string;
}

export interface PersonView {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  channel: string;
  relationship: string;
  status: string;
  active: string;
  stage: string;
  ai_description: string;
  who_they_are: string;
  relationship_context: string;
  last_contacted: string;
  open_threads: number;
  threads: PersonThread[];
  suggested_next_action: string;
  communication_tone: string[];
  communication_notes: string;
  important_context: ImportantContext[];
  uncertainties: string[];
  claims: PersonClaim[];
}

export interface MeetingTodo {
  owner: string;
  task: string;
  due?: string | null;
}

export interface MeetingFollowUp {
  recipients: string[];
  subject: string;
  summary: string;
  todos: MeetingTodo[];
}

export interface ApiMeeting {
  id: string;
  title: string;
  starts_at: string;
  attendees: string[];
  prep: string;
  questions: string[];
  action_items: string[];
  follow_up?: MeetingFollowUp | null;
  source: string;
}

export interface TodoView {
  id: string;
  text: string;
  source: string;
  source_id: string;
  context: string;
  priority?: string | null;
  deadline?: string | null;
  created_at?: string | null;
}

export interface ApiUserProfile {
  id: string;
  name: string;
  full_name: string;
  email: string;
  role: string;
  company: string;
  assistant_name: string;
  routines: string[];
  /** Completed the onboarding flow. Account-level, not per-browser. */
  onboarded?: boolean;
}

export interface TriageResultApi {
  email_id: string;
  category: string;
  priority: string;
  needs_reply: boolean;
  confidence: number;
  summary: string;
  why_it_matters: string;
  suggested_action: string;
  deadline_if_any?: string | null;
  risk_if_ignored: string;
}

export interface DailyBrief {
  id: string;
  generated_at: string;
  top_priority: TriageResultApi[];
  need_reply: TriageResultApi[];
  drafts_ready: string[];
  suggested_actions: string[];
  summary: string;
}
