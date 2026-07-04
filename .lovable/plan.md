
## People page — AI relationship memory

Rename `/contacts` to `/people` and rebuild it as a lightweight AI relationship memory system. Add a detail route per person with a full AI-generated profile. Sidebar link updated. Mock data only.

### Routes

- `src/routes/_app.people.tsx` — list view (replaces `_app.contacts.tsx`, which is deleted).
- `src/routes/_app.people.$personId.tsx` — detail view.

Update sidebar entry in `src/components/workspace/AppSidebar.tsx` from "Contacts" → "People" pointing to `/people`. Each route has its own `head()` title/description.

### Mock data (extend `src/lib/mock-data.ts`)

Extend `mockContacts` into a richer `mockPeople` array (keep old export as alias to avoid breaking anything). Each person has:

- `id`, `name`, `email`, `company`, `role`, `channel` (website/YouTube/Slack), `socials` (twitter/youtube/linkedin optional)
- `relationship`: `Creator Partner | Influencer | Internal Team | Finance | Product Access | Sales Lead | Customer | Personal`
- `status`: `Needs reply | Waiting for them | Waiting for payment | Video in review | Access issue | Active collaboration | Paused`
- `aiDescription` — 1–2 sentence AI summary
- `whoTheyAre` — longer AI paragraph
- `relationshipContext` — how user knows them, stage, active/paused
- `lastContacted`, `openThreads: number`
- `threads[]` — `{ subject, snippet, needsReplyFrom: 'you'|'them', suggestedNext }`
- `suggestedNextAction` — single clear recommendation string
- `communicationStyle` — `{ tone: string[], notes: string }`
- `importantContext[]` — key/value list (Agreed rate, Payment status, Video status, Product access, Referral code, Tracking link, Deadlines, Risks)
- `uncertainties[]` — strings
- `claims[]` — `{ text, sourceType: 'email'|'meeting'|'manual note', observedDate, confidence: 'high'|'medium'|'low' }`

Seed ~6 people tied to existing mock threads: Krishna Patel (Creator Partner, Waiting for payment), Maya Chen (Influencer, Video in review), PJ Okoye (Creator Partner, Needs reply), Max Herrera (Product Access, Access issue), Ana Rivera (Internal Team, Active collaboration), Rina Alvarez (Sales Lead, Waiting for them), Finance @ SuperIntern (Finance, Active collaboration).

### List page (`/people`)

Top of page:
- `PageHeader` title "People" with subtitle.
- Notice card (reuses `TrustBanner`-style pattern): "EmailOS builds working profiles from your conversations. You can edit or delete anything it remembers."
- Action row: `Create contact`, `Import contacts`, `Enable Google Contacts` (buttons wired to `sonner` toasts — no real logic).

Below: card list (responsive: table-like row on desktop, stacked card on mobile). Each row shows avatar initials, name, email, company/channel, `RelationshipBadge`, `StatusBadge`, short AI description, last contacted, open thread count pill, and an "Open" action button linking to `/people/$personId`.

New small components (co-located, no new files unless needed):
- `RelationshipBadge` and `StatusBadge` — extend `src/components/workspace/Badges.tsx` with color-coded variants per type/status.

### Detail page (`/people/$personId`)

Two-column layout on desktop, single column on mobile. Left column: identity + suggested next action pinned near top. Right column: sections below.

Sections (each as a rounded card matching existing `bg-card` / `shadow-[var(--shadow-soft)]` style):

1. **Contact** — email, company, role, channel/website, social handles.
2. **Who they are** — AI summary paragraph.
3. **Your relationship** — how user knows them, stage, active/paused indicator.
4. **Recent / Open threads** — list of threads with "Needs reply from you/them" tag and suggested next step per thread.
5. **Suggested next action** — prominent callout card with a primary action button (toast).
6. **Communication style** — tone chips + notes.
7. **Important context** — two-column key/value grid.
8. **Uncertainties** — muted bulleted list with a subtle "low-confidence" treatment.
9. **Claims / Sources** — list where each item shows text, source type icon (Mail / Calendar / StickyNote), observed date, and a confidence pill (high/medium/low).

Header row: back link to `/people`, name, relationship + status badges, "Edit" and "Delete" buttons (toast placeholders — matches the notice card promise).

If `personId` doesn't match, render `notFound()` with a `notFoundComponent`.

### Design notes

- Reuse existing tokens (cream, border, muted). No new colors.
- Badges use subtle tinted backgrounds — status colors differentiated but staying calm (e.g. amber tint for "Waiting for payment", blue for "Video in review", rose for "Access issue", green for "Active collaboration", neutral for "Paused").
- Instrument Serif for section titles, Inter for body — matches current pages.
- No new packages.

### Technical details

- Delete `src/routes/_app.contacts.tsx`; router auto-regenerates `routeTree.gen.ts`.
- `createFileRoute("/_app/people")` and `createFileRoute("/_app/people/$personId")`.
- Detail route uses `Route.useParams()` to look up person; missing person → `throw notFound()` with a `notFoundComponent` that offers a link back to `/people`.
- All buttons (Create/Import/Enable Google Contacts/Edit/Delete/Next action) call `toast(...)` — no state mutation required.
- Keep mock data pure — no server functions, no Lovable Cloud.
