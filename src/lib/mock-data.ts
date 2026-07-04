export type Priority = "high" | "medium" | "low";
export type Category =
  | "Need Reply"
  | "Important"
  | "FYI"
  | "Meeting"
  | "Payment"
  | "Low Priority"
  | "Product Access";

export interface MockEmail {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  summary: string;
  category: Category;
  priority: Priority;
  suggestedAction: string;
  reason: string;
  time: string;
  needsReply: boolean;
  draftPreview?: string;
  confidence?: number;
  filter?: string;
}

export const mockUser = {
  name: "Theo",
  fullName: "Theo Martin",
  email: "theo@superintern.ai",
  role: "Head of Growth / Partnerships",
  company: "SuperIntern",
  plan: "Free trial",
};

export const mockAssistant = {
  name: "EmailOS",
  email: "assistant@emailos.ai",
};

export const mockEmails: MockEmail[] = [
  {
    id: "e1",
    sender: "Krishna Patel",
    senderEmail: "krishna@creatorlab.co",
    subject: "Quick check — when will payment arrive?",
    summary:
      "Krishna is following up on the $500 sponsorship payment agreed last week. Wants an ETA before Friday.",
    category: "Payment",
    priority: "high",
    suggestedAction: "Confirm payment timeline with finance and reply",
    reason: "Waiting 3 days on a payment you committed to send.",
    time: "42m ago",
    needsReply: true,
    filter: "Payment",
    confidence: 92,
    draftPreview:
      "Hi Krishna — thanks for your patience. Finance has queued the payment for Thursday. I'll share the confirmation as soon as it clears.",
  },
  {
    id: "e2",
    sender: "Maya Chen",
    senderEmail: "maya@youtube-partner.tv",
    subject: "Unlisted video ready for your review",
    summary:
      "Maya sent an unlisted YouTube link with the SuperIntern integration segment. Needs feedback before publishing Monday.",
    category: "Need Reply",
    priority: "high",
    suggestedAction: "Watch the segment and send timestamped notes",
    reason: "Publishing deadline is Monday.",
    time: "1h ago",
    needsReply: true,
    filter: "Creator Partnership",
    confidence: 88,
    draftPreview:
      "Hi Maya — just watched the unlisted cut. Really strong intro. A couple of small notes at 1:14 and 3:02 — mind if we tighten those before Monday?",
  },
  {
    id: "e3",
    sender: "PJ Okoye",
    senderEmail: "pj@ridgepartners.co",
    subject: "Tracking link + referral code for launch",
    summary: "PJ is asking for the tracking link and referral code so his team can prep the launch post.",
    category: "Need Reply",
    priority: "medium",
    suggestedAction: "Generate tracking link and send referral code",
    reason: "Launch content is scheduled for Wednesday.",
    time: "2h ago",
    needsReply: true,
    filter: "Creator Partnership",
    confidence: 95,
    draftPreview:
      "Hey PJ — here's your tracking link and referral code THEO25. Let me know if you need anything else before Wednesday.",
  },
  {
    id: "e4",
    sender: "Sam Reeves",
    senderEmail: "sam@growthfoundry.io",
    subject: "Does SuperIntern support Gmail?",
    summary: "Sam is evaluating tools for his team. Simple yes/no question with a small follow-up.",
    category: "Need Reply",
    priority: "medium",
    suggestedAction: "Confirm Gmail support and share doc link",
    reason: "Warm sales lead evaluating this week.",
    time: "3h ago",
    needsReply: true,
    filter: "Sales",
    confidence: 90,
  },
  {
    id: "e5",
    sender: "Jade Lin",
    senderEmail: "jade@jadecreates.com",
    subject: "Rate for the campaign",
    summary: "Jade says $300 flat is her minimum for the campaign, no negotiation.",
    category: "Important",
    priority: "medium",
    suggestedAction: "Decide on budget and reply",
    reason: "Blocking a signed partnership.",
    time: "5h ago",
    needsReply: true,
    filter: "Creator Partnership",
    confidence: 78,
  },
  {
    id: "e6",
    sender: "Ana (Internal)",
    senderEmail: "ana@superintern.ai",
    subject: "Feedback on new positioning video?",
    summary: "Ana is asking for your review on the 90-second product positioning cut before the team meeting.",
    category: "Important",
    priority: "medium",
    suggestedAction: "Watch and send notes",
    reason: "Team review scheduled tomorrow.",
    time: "6h ago",
    needsReply: true,
  },
  {
    id: "e7",
    sender: "Max Herrera",
    senderEmail: "max@stackednorth.co",
    subject: "Can't log into SuperIntern",
    summary: "Max signed up but is stuck on the Gmail OAuth screen — screenshot attached.",
    category: "Product Access",
    priority: "high",
    suggestedAction: "Escalate to support and confirm access",
    reason: "Blocked partner in trial.",
    time: "8h ago",
    needsReply: true,
    filter: "Product Access",
    confidence: 84,
  },
  {
    id: "e8",
    sender: "Finance @ SuperIntern",
    senderEmail: "finance@superintern.ai",
    subject: "Payment run confirmation",
    summary: "Finance confirms Thursday's payment run includes Krishna, Jade, and two other creators.",
    category: "FYI",
    priority: "low",
    suggestedAction: "No action — reference when replying to creators",
    reason: "Useful context, no reply required.",
    time: "9h ago",
    needsReply: false,
  },
  {
    id: "e9",
    sender: "Rina Alvarez",
    senderEmail: "rina@northlightco.com",
    subject: "30 min next week?",
    summary: "Rina proposes 30 minutes Tuesday or Wednesday afternoon to discuss a co-marketing angle.",
    category: "Meeting",
    priority: "medium",
    suggestedAction: "Offer two time slots",
    reason: "New partnership opportunity.",
    time: "1d ago",
    needsReply: true,
    filter: "Meeting",
    confidence: 91,
  },
  {
    id: "e10",
    sender: "Devon King",
    senderEmail: "devon@twoblocks.tv",
    subject: "Following up on collab terms",
    summary: "Devon is nudging on the collaboration terms document you said you'd send over.",
    category: "Need Reply",
    priority: "high",
    suggestedAction: "Send terms doc or ETA",
    reason: "You promised this last Thursday.",
    time: "1d ago",
    needsReply: true,
    filter: "Creator Partnership",
    confidence: 87,
  },
];

export const mockDrafts = mockEmails
  .filter((e) => e.draftPreview)
  .map((e) => ({
    id: `d-${e.id}`,
    emailId: e.id,
    to: e.sender,
    toEmail: e.senderEmail,
    subject: `Re: ${e.subject}`,
    originalSummary: e.summary,
    body: e.draftPreview!,
    tone: "Professional" as const,
    risk: e.priority === "high" ? "Time-sensitive" : undefined,
  }));

export const mockFollowUps = [
  {
    id: "f1",
    person: "Krishna Patel",
    context: "You told Krishna you would send the tracking link.",
    suggested: "Hi Krishna — here's the tracking link we discussed. Let me know if it works on your end.",
    due: "Today",
    status: "Pending" as const,
  },
  {
    id: "f2",
    person: "Jade Lin",
    context: "Creator asked when payment will be sent.",
    suggested: "Hey Jade — payment is queued for Thursday's run. I'll confirm as soon as it clears.",
    due: "Tomorrow",
    status: "Pending" as const,
  },
  {
    id: "f3",
    person: "Max Herrera",
    context: "Max is waiting for product access.",
    suggested: "Hey Max — sorry about the login hiccup. Support is fixing your Gmail OAuth now, should be live in an hour.",
    due: "Today",
    status: "Pending" as const,
  },
  {
    id: "f4",
    person: "PJ Okoye",
    context: "Follow up with PJ about collaboration details.",
    suggested: "Hey PJ — circling back on the collab terms doc. I'll have a draft to you by end of day.",
    due: "This week",
    status: "Pending" as const,
  },
];

export const mockMeetings = [
  {
    id: "m1",
    title: "Creator sync — Maya Chen",
    time: "Today · 2:00 PM",
    attendees: ["Maya Chen", "Theo Martin"],
    prep: "Review Maya's unlisted YouTube cut. Discuss timestamps 1:14 and 3:02.",
    questions: [
      "Can we tighten the SuperIntern intro to 15 seconds?",
      "Are we ok promoting the referral code in the description?",
    ],
    actionItems: ["Send revised script notes", "Confirm publish date"],
  },
  {
    id: "m2",
    title: "Partnership intro — Rina Alvarez",
    time: "Tomorrow · 11:30 AM",
    attendees: ["Rina Alvarez", "Theo Martin"],
    prep: "Northlight is exploring a co-marketing angle for Q1. Bring the partner deck.",
    questions: ["What audience overlap are you seeing?", "Are you open to a shared referral program?"],
    actionItems: ["Share partner deck", "Send follow-up with next steps"],
  },
  {
    id: "m3",
    title: "Internal — Positioning review",
    time: "Thu · 4:00 PM",
    attendees: ["Ana", "Theo", "Product"],
    prep: "Watch the 90s positioning cut. Prepare 3 pieces of feedback.",
    questions: ["Is the pain clear in the first 10 seconds?", "Does the CTA feel natural?"],
    actionItems: ["Send timestamped feedback", "Approve final cut"],
  },
];

export const mockContacts = [
  {
    id: "c1",
    name: "Krishna Patel",
    email: "krishna@creatorlab.co",
    company: "Creator Lab",
    relationship: "Creator partner",
    recent: "Following up on payment.",
    tone: "Warm, direct",
    notes: "Prefers short replies. Pays attention to timelines.",
    lastContact: "3 days ago",
  },
  {
    id: "c2",
    name: "Ana Rivera",
    email: "ana@superintern.ai",
    company: "SuperIntern",
    relationship: "Internal team",
    recent: "Reviewing positioning video.",
    tone: "Friendly, collaborative",
    notes: "Marketing lead. Owns product story.",
    lastContact: "Today",
  },
  {
    id: "c3",
    name: "Finance @ SuperIntern",
    email: "finance@superintern.ai",
    company: "SuperIntern",
    relationship: "Finance",
    recent: "Confirmed payment run.",
    tone: "Concise, formal",
    notes: "Handles all creator payouts. CC on payment threads.",
    lastContact: "9h ago",
  },
  {
    id: "c4",
    name: "Max Herrera",
    email: "max@stackednorth.co",
    company: "Stacked North",
    relationship: "Product access",
    recent: "Login issue with Gmail OAuth.",
    tone: "Patient, technical",
    notes: "Evaluating trial. Blocked on OAuth.",
    lastContact: "8h ago",
  },
  {
    id: "c5",
    name: "PJ Okoye",
    email: "pj@ridgepartners.co",
    company: "Ridge Partners",
    relationship: "Creator partner",
    recent: "Needs tracking link + referral code.",
    tone: "Direct",
    notes: "Runs launch content for enterprise creators.",
    lastContact: "2h ago",
  },
  {
    id: "c6",
    name: "Rina Alvarez",
    email: "rina@northlightco.com",
    company: "Northlight",
    relationship: "Prospective partner",
    recent: "Proposed intro call next week.",
    tone: "Professional, warm",
    notes: "Explores co-marketing partnerships.",
    lastContact: "1d ago",
  },
];

export const mockMemory = {
  "Communication style": [
    "Concise and action-oriented",
    "Polite but direct",
    "Starts with brief appreciation before the ask",
    "Professional tone for external communication",
  ],
  "Common phrases": [
    "Thanks for the patience on this.",
    "Circling back on…",
    "Let me know if this works on your end.",
    "Appreciate you flagging.",
  ],
  "Business context": [
    "SuperIntern — Head of Growth / Partnerships",
    "Focus on creator partnerships and influencer outreach",
    "Owns tracking links, referral codes, and creator payments",
  ],
  "Important contacts": [
    "Krishna Patel — Creator Lab (payments)",
    "Ana Rivera — Internal team (positioning)",
    "Finance @ SuperIntern — Payment runs",
  ],
  "Partnership preferences": [
    "Prefer flat-fee deals under $500 without approval",
    "Always confirm publish window before signing",
    "Ask for unlisted preview 48h before publish",
  ],
  "Payment rules": [
    "Payments processed on Thursdays",
    "Escalate to finance if creator is waiting >5 days",
    "Include referral code and tracking link on first payment email",
  ],
  "Product access rules": [
    "Escalate Gmail OAuth issues directly to support",
    "Follow up within 24h on access blockers",
  ],
};

export const homeNeedToKnow = [
  {
    id: "n1",
    text: "Krishna is waiting for payment confirmation.",
    time: "42m ago",
  },
  {
    id: "n2",
    text: "Maya sent an unlisted video for review.",
    time: "1h ago",
  },
  {
    id: "n3",
    text: "Max is blocked on Gmail access — may need your reply.",
    time: "8h ago",
  },
];

export const homeSuggestions = [
  "Review Maya's YouTube video feedback",
  "Draft payment update for Krishna",
  "Send tracking link to PJ",
  "Follow up with Devon on collaboration terms",
  "Confirm Gmail access for Max",
];

export const taskExamples = [
  "Draft replies to today's creator emails",
  "Summarize important emails from the last 24 hours",
  "Find payments I need to follow up on",
  "Prepare a follow-up email for Krishna",
  "Show me what I need to reply to",
];
