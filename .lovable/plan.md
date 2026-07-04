## Goal

Add a **To-do** page that aggregates the user's personal action items surfaced by the meeting AI (from each meeting's follow-up `todos`). Only items owned by the user (Theo) show up — this is "my to-do list", not the whole team's.

## Changes

### 1. Sidebar (`AppSidebar.tsx`)
Insert a "To-do" entry (icon `ListChecks`) between Calendar and Meetings.

Final order: Home · Inbox · Calendar · **To-do** · Meetings · People · Memory · Settings.

### 2. New route `src/routes/_app.todo.tsx`

Route path `/todo`. Layout consistent with other pages (`max-w-5xl`, `PageHeader`).

**Header:**
- Title: "Your to-do list"
- Subtitle: "Action items your meeting assistant pulled out for you."

**Source note card** (small, muted): "These items were surfaced by EmailOS from your meeting follow-ups. Complete them here or in the original meeting."

**Filter chips row:** All · Open · Done · By meeting (dropdown/simple chips per meeting title).

**List:**
Each todo row:
- Checkbox (toggles done/open — local state, persisted via zustand + localStorage)
- Task text (strike-through when done, muted color)
- Due badge (small pill) if present
- Right side: source chip "From: <meeting title>" — clicking navigates to `/meetings`
- Subtle hover state, `bg-card` rounded row with border

Empty state when no todos match filter.

**Bottom summary:** "N open · M done" small footer text.

### 3. Data source

Reuse the `followUp.todos` already on `mockMeetings` (added in the previous meetings feature). Filter to items where `owner` is the user — treat `"Theo"` (and any owner string containing "theo", case-insensitive) as the user's items.

Aggregate at render time:
```
const myTodos = mockMeetings.flatMap(m =>
  m.followUp.todos
    .filter(t => t.owner.toLowerCase().includes("theo"))
    .map((t, i) => ({
      id: `${m.id}-${i}`,
      meetingId: m.id,
      meetingTitle: m.title,
      task: t.task,
      due: t.due,
    }))
);
```

No new mock data added — the meeting AI is the sole source, as the user described.

### 4. Done-state store (`src/lib/todo-store.ts`)

Small zustand + persist store:
```
{
  doneMap: Record<todoId, boolean>,
  toggle(id): void,
}
```
Persisted key: `emailos-todos-v1`. Keeps completion state across reloads. No creation/deletion — todos are always derived from meetings.

### 5. Home page nudge (optional, minimal)
If `_app.home.tsx` currently has a "Follow-ups" or similar block, leave it alone. Not touching Home in this pass unless a broken link exists.

### 6. Head metadata
```
title: "To-do — EmailOS AI"
description: "Personal action items your meeting assistant pulled out for you."
```
+ matching og tags.

## Out of scope
- No manual todo creation, no editing text, no reordering, no assignments to others.
- No due-date picker; `due` is displayed as-is from the meeting summary.
- No push to calendar or email.
- No changes to Meetings page's todo rendering.
