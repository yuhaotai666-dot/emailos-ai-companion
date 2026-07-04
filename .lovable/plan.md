
# EmailOS AI — Build Plan

A premium, calm, personal AI email assistant UI. Mock data only. No backend, no real integrations. Design leans warm-minimal (Town/Superhuman feel): off-white background, cream sections, subtle borders, rounded cards, soft shadows, serif headlines for onboarding, sans-serif body.

## Design system (src/styles.css)

Redefine tokens to warm palette:
- `--background`: warm off-white (~oklch(0.985 0.005 85))
- `--card`: cream (~oklch(0.975 0.01 80))
- `--foreground`: near-black warm grey
- `--muted`: soft beige
- `--border`: subtle warm grey
- `--primary`: warm near-black (buttons)
- `--accent`: muted blue/purple, used sparingly
- Soft shadow token, larger radius default (`--radius: 0.875rem`)

Fonts (loaded via `<link>` in `__root.tsx` head, then referenced in `@theme`):
- Headings/onboarding titles: **Instrument Serif** (serif elegance)
- Body/UI: **Inter** (clean sans)

Update `__root.tsx` head metadata to real EmailOS AI title/description/OG.

## Routes (TanStack file-based)

```
src/routes/
  __root.tsx              (updated head, fonts, OG)
  index.tsx               → redirects to /onboarding or /home (mock: land on /onboarding first-time via localStorage flag, else /home)
  onboarding.tsx          (layout with centered card, progress dots, back arrow, Outlet)
  onboarding.index.tsx    → step 1 Welcome
  onboarding.connect.tsx  → step 2 Connect accounts
  onboarding.assistant.tsx→ step 3 Create assistant
  onboarding.routines.tsx → step 4 Routines
  onboarding.profile.tsx  → step 5 Profile summary → "Finish setup" → /home
  _app.tsx                (workspace layout: left sidebar + main + right panel slot)
  _app.home.tsx
  _app.inbox.tsx
  _app.need-reply.tsx
  _app.drafts.tsx
  _app.follow-ups.tsx
  _app.meetings.tsx
  _app.contacts.tsx
  _app.memory.tsx
  _app.settings.tsx
```

Each route sets its own `head()` with distinct title/description.

## Components

Reusable, in `src/components/`:

**Onboarding**
- `OnboardingCard` — centered rounded cream card, back arrow, progress dots, footer with primary + skip CTA
- `StepDots`
- `ValuePoint` (icon + line)
- `ConnectionCard` (app icon, name, description, Connect/Connected pill button)
- `RoutineCard` (title, description, toggles list, warning slot)
- `PersonaTile` (avatar tile, selectable)
- `PersonalityChip` (selectable chip)

**Workspace**
- `AppSidebar` — logo, search, New, nav items (Home, Inbox, Need Reply, Drafts, Follow-ups, Meetings, Contacts, Memory, Settings), assistant card + user card at bottom (uses shadcn Sidebar with `collapsible="icon"`)
- `TaskInput` — large central input card with action icons (Add, People, Schedule, Shield, Voice, Task type)
- `RightPanel` with `NeedToKnowCard` + `SuggestionsCard`
- `EmailCard` (sender, subject, AI summary, category badge, priority badge, suggested action, reason, actions)
- `PriorityBadge`, `CategoryBadge` (muted, no bright colors)
- `DraftCard` + `DraftEditorModal` (shadcn Dialog: left context, right editable textarea, tone selector, Regenerate/Save/Create Gmail Draft)
- `FollowUpCard`
- `MeetingCard`
- `ContactCard`
- `MemoryItem` (editable inline)
- `SettingsToggleRow`, `SettingsSection`
- `EmptyState`, `TrustBanner` ("AI drafts. You approve.")

## Mock data (`src/lib/mock-data.ts`)

- `mockEmails` — 10 realistic emails (creator payment, YouTube unlisted review, tracking link, Gmail support, $300 flat fee, internal video feedback, product access, finance confirmation, meeting scheduling, partnership follow-up)
- `mockDrafts`, `mockFollowUps`, `mockMeetings`, `mockContacts`, `mockMemory`
- `mockUser` = Theo, Head of Growth / Partnerships @ SuperIntern
- `mockAssistant` = { name: "EmailOS", email: "assistant@emailos.ai" }

State: lightweight `zustand` store (or React context) for onboarding selections + assistant name/personality. Persist to `localStorage` so onboarding completion routes to `/home`.

## Page details

**/onboarding steps** — each uses `OnboardingCard`. Progress dots reflect current step. Back arrow uses router history. Primary CTA advances to next route. Step 5 "Finish setup" sets `localStorage.emailos_onboarded = true` and navigates to `/home`.

**/home** — Date + View schedule link, serif greeting "Good afternoon, Theo. You have 7 emails that need your attention.", central `TaskInput` with 5 example prompts as ghost chips below, Tasks + Recents sections (empty state), right panel with Need to know (3 items) + Suggestions (5 items).

**/inbox** — Header + subtext, Tabs (All / Need Reply / Important / FYI / Low Priority), list of `EmailCard`s filtered by tab.

**/need-reply** — Filter chips (High Priority, Creator Partnership, Payment, Meeting, Sales, Product Access), cards with why/suggested direction/draft preview/confidence, actions Review Draft / Create Gmail Draft / Ignore. Trust banner.

**/drafts** — `DraftCard` list, persistent trust notice, click Edit opens `DraftEditorModal`.

**/follow-ups** — Follow-up cards with person, context, suggested message, due date, status, Draft follow-up button.

**/meetings** — Sections: Upcoming, Prep, Summaries, Action items, Follow-up drafts.

**/contacts** — Contact cards grid.

**/memory** — Sections list with editable items, safety copy.

**/settings** — 5 sections (Gmail Connection, AI Preferences, Email Categories, Safety Settings, Notifications) with toggles and selectors.

## Technical notes

- All views use mock data only. Buttons for Gmail/Calendar/Slack/WhatsApp/Telegram are placeholders that toast "Coming soon" via shadcn `sonner`.
- Icons: Lucide.
- No new packages needed beyond what's installed (shadcn already present). Add `zustand` only if state gets messy; otherwise React context is fine.
- Responsive: desktop-first; sidebar collapses to icon on smaller widths; right panel stacks below main on narrow screens.
- Accessibility: proper heading levels, focus states, aria labels on icon buttons.

## Out of scope (explicitly)

- Real Gmail/Calendar/Slack/WhatsApp/Telegram integration
- Auth, backend, database (Lovable Cloud NOT enabled — mock only)
- Real AI calls
- Payments

## Deliverable

A polished, calm, elegant static UI that hangs together end-to-end with mock data, ready to wire to a real backend later.
