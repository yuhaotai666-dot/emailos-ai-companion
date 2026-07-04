## Goal

Remove Need Reply and Drafts pages, add a Calendar page in their place.

## Changes

### 1. Delete routes
- `src/routes/_app.need-reply.tsx`
- `src/routes/_app.drafts.tsx`

### 2. Sidebar (`src/components/workspace/AppSidebar.tsx`)
Replace the "Need Reply" and "Drafts" entries with a single "Calendar" entry (icon `CalendarDays`). Remove now-unused `MessageSquareReply` and `PenLine` imports. Keep Meetings entry as-is.

Final order: Home · Inbox · Calendar · Meetings · People · Memory · Settings.

### 3. New page `src/routes/_app.calendar.tsx`

A calm month-view calendar consistent with the existing cream/border/shadow-soft design language.

Layout (`max-w-5xl px-6 lg:px-10 py-10`):
- `PageHeader` — title "Calendar", subtitle "Your meetings and email-driven events in one calm view."
- Toolbar row:
  - Left: `‹` / `›` buttons + current month/year label (`font-serif text-xl`) + "Today" button
  - Right: view switcher chips (Month / Week) — Month active, Week shows a "Coming soon" toast
- Month grid:
  - 7-column grid, Sun–Sat header row
  - 6 week rows (42 cells) built from `startOfMonth` + weekday offset (pure date math, no date-fns dependency)
  - Each cell: rounded-lg border, `bg-card` for current month days / `bg-cream/30` for adjacent-month days, `text-muted-foreground` for those. Today gets a filled `bg-foreground text-background` circle around the date number.
  - Cell shows up to 2 event pills; if more, "+N more" muted line.
- Below grid: "Upcoming this week" section — vertical list of the next ~4 events with time, title, source badge.

### 4. Event data source

Derive calendar events from existing `mockMeetings` plus a few seeded email-driven events (e.g. "Payment run — creators", "Publish window — Maya video"). Add `mockCalendarEvents` array to `src/lib/mock-data.ts`:

```ts
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;      // ISO yyyy-mm-dd
  time?: string;     // "2:00 PM"
  source: "meeting" | "email" | "reminder";
  meetingId?: string;
}
```

Seed ~8 events across the current week/month so the grid looks alive. Anchor dates around `new Date()` at runtime (compute today + N days) so the calendar is always populated relative to the viewing date.

Event pills use subtle tinted classes per `source`:
- meeting → blue tint
- email → amber tint
- reminder → slate tint

### 5. Head metadata
```
title: "Calendar — EmailOS AI"
description: "Your meetings and email-driven events in one calm view."
```
Plus matching og:title/og:description.

### 6. Cleanup
- Search for any residual `to="/need-reply"` / `to="/drafts"` `<Link>` usages (home page, empty states) — replace with `/inbox` or remove.
- `__root.tsx` description string mentions "Drafts, follow-ups"; leave marketing copy untouched (not a route reference).

## Out of scope
- No new npm packages (no date-fns, no react-day-picker for the month grid — it's a static display, not a date input).
- No drag-and-drop, no event creation UI. Clicking a meeting event navigates to `/meetings`; clicking any other event shows a toast placeholder.
- Mobile: grid collapses to smaller cells but stays 7-column; that's acceptable for this pass.
