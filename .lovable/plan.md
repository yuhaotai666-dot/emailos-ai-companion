## Goal

Replace hardcoded email `category` labels with a user-managed **Events** system. Each email can be tagged with **one event** representing the event it belongs to. Events are shared globally and reusable across emails.

## Data model (`src/lib/mock-data.ts`)

- Add `Event` type: `{ id, name, color }` where color is one of a small preset palette (amber, blue, rose, green, violet, slate).
- Add `mockEvents` seed list (~5 events tied to SuperIntern context, e.g. "Krishna Partnership", "Q4 Payout Batch", "Maya Onboarding", "Access Issues", "Podcast Sponsorship").
- Extend `Email` with optional `eventId?: string`. Keep existing `category` for the AI classification pill (unchanged).
- Add a lightweight in-memory store `src/lib/events-store.ts` using `zustand` (already in project) or a simple module-level store + subscription hook, exposing:
  - `events`, `addEvent(name, color)`, `renameEvent`, `deleteEvent`
  - `emailEventMap: Record<emailId, eventId>`, `setEmailEvent(emailId, eventId | null)`
  - Seeded from mock data on init. Persist to `localStorage` so labels survive reload.

## Inbox UI (`src/routes/_app.inbox.tsx`)

### Top of page — two filter rows

1. **Priority row (existing):** All / Need Reply / Important / FYI / Low Priority — kept as-is.
2. **Event row (new):** horizontal chip strip below priority row:
   - `All events` + one chip per event (colored dot + name + count).
   - Trailing `+ New event` chip opens the Manage Events popover.
   - Active chip uses tinted background matching the event color.

Both filters combine with AND. Empty state when zero matches.

### Email card — label control next to "Mark done"

In the row that currently holds Mark done / Draft reply actions, add a new `EventLabelPicker` button placed immediately beside Mark done:

- Idle state (no event): ghost button `Tag` icon + "Add event".
- Assigned state: colored dot + event name in a subtle pill; click reopens picker; small `×` to clear.
- Click opens a `Popover` (shadcn) with:
  - Search input
  - Scrollable list of existing events (colored dot + name, checkmark on current)
  - `+ Create "<query>"` row when the query has no exact match
  - Footer link `Manage events…`

### Manage Events dialog

A `Dialog` reachable from the `+ New event` chip and the picker footer:
- List of events with inline rename, color swatch dropdown, delete.
- "New event" input with color picker.
- Deleting an event clears it from any emails that used it (with confirm).

## Component additions

- `src/components/workspace/EventBadge.tsx` — colored dot + name pill (sizes sm/md).
- `src/components/workspace/EventLabelPicker.tsx` — the popover picker described above.
- `src/components/workspace/EventFilterBar.tsx` — the chip strip.
- `src/components/workspace/ManageEventsDialog.tsx` — the dialog.

All use existing shadcn primitives (`Popover`, `Command`, `Dialog`, `Input`, `Button`) and reuse the cream/border/muted tokens. No new npm packages.

## Search params

Add `event?: string` to Inbox `validateSearch` (via `@tanstack/zod-adapter` `fallback`) so the active event filter is shareable/reload-safe alongside the existing priority filter (if any). Reset button clears both.

## Out of scope

- No change to the AI `category` pill on emails (Payment / Meeting / FYI…). Events are user-defined and additional to it.
- No change to other pages (People, Drafts, Follow-ups). Event tagging is Inbox-only in this pass; the store is designed to extend later.
- No backend — everything is client mock data + localStorage.

## Technical notes

- Use `useSyncExternalStore` or `zustand` for the store so the picker, filter bar, and email list update in sync.
- Keep colors as semantic classes (e.g. `bg-amber-100 text-amber-900 border-amber-200`) mapped from `event.color` via a small helper — no arbitrary hex in components.
- Preserve current Inbox layout, spacing, and typography. Only the two additions (event chip row + label picker beside Mark done) are new visual elements.
