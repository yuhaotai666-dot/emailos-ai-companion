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
  /** Full draft text for the reply editor (draftPreview is truncated). */
  draftBody?: string;
  confidence?: number;
  filter?: string;
  /** Real snippet of the email body (present when data comes from the backend). */
  bodyPreview?: string;
  /** A newer reply arrived after the last triage — analysis shown (if any) is
   *  stale, so the UI should prompt a re-triage instead of trusting it. */
  needsRetriage?: boolean;
  /** This message has a real triage result. When false, priority/category are
   *  placeholders and must not be shown as if classified. */
  triaged?: boolean;
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
  name: "Ivy",
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

export interface MeetingFollowUpTodo {
  owner: string;
  task: string;
  due?: string;
}

export interface MeetingFollowUp {
  generatedAt: string;
  recipients: string[];
  subject: string;
  summary: string;
  todos: MeetingFollowUpTodo[];
}

export interface MockMeeting {
  id: string;
  title: string;
  time: string;
  attendees: string[];
  prep: string;
  questions: string[];
  actionItems: string[];
  followUp: MeetingFollowUp;
}

export const mockMeetings: MockMeeting[] = [
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
    followUp: {
      generatedAt: "2 min after meeting",
      recipients: ["maya@youtube-partner.tv", "theo@superintern.ai"],
      subject: "Recap & next steps — Creator sync",
      summary:
        "We walked through the unlisted cut and aligned on tightening the SuperIntern intro to 15 seconds. Maya will re-edit timestamps 1:14 and 3:02, and we agreed to include the THEO25 referral code in the pinned comment and description. Publish window is confirmed for Monday morning.",
      todos: [
        { owner: "Maya", task: "Re-cut intro to 15s and revise 1:14 / 3:02", due: "Sun" },
        { owner: "Maya", task: "Add THEO25 referral code to description + pinned comment", due: "Sun" },
        { owner: "Theo", task: "Send final approval on revised cut", due: "Sun EOD" },
        { owner: "Theo", task: "Confirm payment queued for Thursday run" },
      ],
    },
  },
  {
    id: "m2",
    title: "Partnership intro — Rina Alvarez",
    time: "Tomorrow · 11:30 AM",
    attendees: ["Rina Alvarez", "Theo Martin"],
    prep: "Northlight is exploring a co-marketing angle for Q1. Bring the partner deck.",
    questions: ["What audience overlap are you seeing?", "Are you open to a shared referral program?"],
    actionItems: ["Share partner deck", "Send follow-up with next steps"],
    followUp: {
      generatedAt: "3 min after meeting",
      recipients: ["rina@northlightco.com", "theo@superintern.ai"],
      subject: "Recap & next steps — Northlight × SuperIntern intro",
      summary:
        "Rina outlined Northlight's Q1 co-marketing focus on indie founder audiences, which overlaps ~40% with SuperIntern's creator base. We discussed a shared referral program with split attribution and agreed to pilot a joint newsletter placement before signing anything broader.",
      todos: [
        { owner: "Theo", task: "Send partner deck + audience overlap notes", due: "Tomorrow" },
        { owner: "Rina", task: "Share Northlight's Q1 co-marketing calendar", due: "This week" },
        { owner: "Theo", task: "Draft pilot terms for joint newsletter placement", due: "Next Mon" },
      ],
    },
  },
  {
    id: "m3",
    title: "Internal — Positioning review",
    time: "Thu · 4:00 PM",
    attendees: ["Ana", "Theo", "Product"],
    prep: "Watch the 90s positioning cut. Prepare 3 pieces of feedback.",
    questions: ["Is the pain clear in the first 10 seconds?", "Does the CTA feel natural?"],
    actionItems: ["Send timestamped feedback", "Approve final cut"],
    followUp: {
      generatedAt: "1 min after meeting",
      recipients: ["ana@superintern.ai", "theo@superintern.ai", "product@superintern.ai"],
      subject: "Recap & next steps — Positioning video review",
      summary:
        "Team reviewed the 90-second positioning cut. Consensus: the pain point lands well in the first 10 seconds, but the CTA feels rushed. Ana will tighten the closing 8 seconds and Product will validate the on-screen product shot at 0:42 before Friday's sign-off.",
      todos: [
        { owner: "Ana", task: "Re-cut final 8 seconds with a slower CTA", due: "Thu EOD" },
        { owner: "Product", task: "Confirm product UI shot at 0:42 is current", due: "Fri AM" },
        { owner: "Theo", task: "Send timestamped feedback doc to Ana", due: "Thu" },
        { owner: "Theo", task: "Approve final cut once revisions are in", due: "Fri" },
      ],
    },
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

export const mockKnowledge = {
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

export type RelationshipType =
  | "Creator Partner"
  | "Influencer"
  | "Internal Team"
  | "Finance"
  | "Product Access"
  | "Sales Lead"
  | "Customer"
  | "Personal";

export type PersonStatus =
  | "Needs reply"
  | "Waiting for them"
  | "Waiting for payment"
  | "Video in review"
  | "Access issue"
  | "Active collaboration"
  | "Paused";

export type Confidence = "high" | "medium" | "low";
export type SourceType = "email" | "meeting" | "manual note";

export interface PersonThread {
  subject: string;
  snippet: string;
  needsReplyFrom: "you" | "them";
  suggestedNext: string;
}

export interface PersonClaim {
  text: string;
  sourceType: SourceType;
  observedDate: string;
  confidence: Confidence;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  channel: string;
  website?: string;
  socials?: { twitter?: string; youtube?: string; linkedin?: string };
  relationship: RelationshipType;
  status: PersonStatus;
  aiDescription: string;
  whoTheyAre: string;
  relationshipContext: string;
  stage: string;
  active: "active" | "paused" | "needs follow-up";
  lastContacted: string;
  openThreads: number;
  threads: PersonThread[];
  suggestedNextAction: string;
  communicationStyle: { tone: string[]; notes: string };
  importantContext: { label: string; value: string }[];
  uncertainties: string[];
  claims: PersonClaim[];
}

export const mockPeople: Person[] = [
  {
    id: "krishna-patel",
    name: "Krishna Patel",
    email: "krishna@creatorlab.co",
    company: "Creator Lab",
    role: "Founder & creator",
    channel: "Email · YouTube",
    website: "creatorlab.co",
    socials: { youtube: "@creatorlab", twitter: "@krishpatel" },
    relationship: "Creator Partner",
    status: "Waiting for payment",
    aiDescription:
      "Long-time creator partner running the sponsored SuperIntern segment. Currently waiting on a $500 sponsorship payment you committed to last week.",
    whoTheyAre:
      "Krishna runs Creator Lab, a mid-size YouTube channel focused on productivity tools for indie founders. He typically produces one sponsored segment per month and prefers direct, timeline-driven conversations.",
    relationshipContext:
      "You brought Krishna into the SuperIntern creator program in Q3. He's on his second paid segment with you.",
    stage: "Active sponsorship — awaiting payment clearance",
    active: "needs follow-up",
    lastContacted: "3 days ago",
    openThreads: 2,
    threads: [
      {
        subject: "Quick check — when will payment arrive?",
        snippet: "Following up on the $500 sponsorship payment agreed last week.",
        needsReplyFrom: "you",
        suggestedNext: "Confirm Thursday's payment run and share confirmation once cleared.",
      },
      {
        subject: "Segment analytics — first week",
        snippet: "Krishna shared 7-day performance numbers for the last segment.",
        needsReplyFrom: "you",
        suggestedNext: "Acknowledge numbers and propose a follow-up segment.",
      },
    ],
    suggestedNextAction: "Reply to Krishna with Thursday's payment ETA and confirmation link.",
    communicationStyle: {
      tone: ["Direct", "Warm", "Concise"],
      notes: "Prefers short replies with clear dates. Skip small talk. Always confirm timelines in writing.",
    },
    importantContext: [
      { label: "Agreed rate", value: "$500 flat / segment" },
      { label: "Payment status", value: "Queued for Thursday's run" },
      { label: "Referral code", value: "KRISHNA25" },
      { label: "Tracking link", value: "superintern.ai/r/krishna" },
      { label: "Deadlines", value: "Reply before Friday" },
      { label: "Risks", value: "Don't promise same-day payment — finance owns the run." },
    ],
    uncertainties: [
      "Whether Krishna wants to book a third segment this quarter.",
      "Whether the current rate holds for a longer-form video.",
    ],
    claims: [
      {
        text: "$500 flat rate agreed for the current segment.",
        sourceType: "email",
        observedDate: "6 days ago",
        confidence: "high",
      },
      {
        text: "Prefers payment confirmation before publishing.",
        sourceType: "email",
        observedDate: "3 days ago",
        confidence: "high",
      },
      {
        text: "Open to a Q1 follow-up segment.",
        sourceType: "meeting",
        observedDate: "2 weeks ago",
        confidence: "medium",
      },
    ],
  },
  {
    id: "maya-chen",
    name: "Maya Chen",
    email: "maya@youtube-partner.tv",
    company: "Independent",
    role: "YouTube creator",
    channel: "Email · YouTube",
    website: "youtube.com/@mayachen",
    socials: { youtube: "@mayachen", twitter: "@mayacreates" },
    relationship: "Influencer",
    status: "Video in review",
    aiDescription:
      "Independent YouTube creator who just sent an unlisted cut of the SuperIntern integration segment. Publishing Monday.",
    whoTheyAre:
      "Maya makes long-form YouTube essays on creator economy tooling. Her audience is smaller than Krishna's but skews founder / operator, which converts well.",
    relationshipContext:
      "First paid collaboration with Ivy. Currently in review stage — she wants feedback before publishing.",
    stage: "Review stage — unlisted cut pending approval",
    active: "active",
    lastContacted: "1h ago",
    openThreads: 1,
    threads: [
      {
        subject: "Unlisted video ready for your review",
        snippet: "Unlisted YouTube link with SuperIntern integration segment.",
        needsReplyFrom: "you",
        suggestedNext: "Watch the segment and send timestamped notes at 1:14 and 3:02.",
      },
    ],
    suggestedNextAction: "Review the unlisted YouTube video and send timestamped notes before Monday.",
    communicationStyle: {
      tone: ["Friendly", "Professional"],
      notes: "Appreciates specific timestamps and rationale. Avoid vague feedback.",
    },
    importantContext: [
      { label: "Agreed rate", value: "$750 flat" },
      { label: "Video status", value: "Unlisted cut delivered" },
      { label: "Deadlines", value: "Publish Monday" },
      { label: "Referral code", value: "MAYA25" },
      { label: "Risks", value: "Don't request structural rewrites — publish window is tight." },
    ],
    uncertainties: ["Whether Maya wants a second segment this year."],
    claims: [
      {
        text: "Unlisted cut sent 1h ago.",
        sourceType: "email",
        observedDate: "1h ago",
        confidence: "high",
      },
      {
        text: "Publish scheduled for Monday.",
        sourceType: "email",
        observedDate: "1h ago",
        confidence: "high",
      },
    ],
  },
  {
    id: "pj-okoye",
    name: "PJ Okoye",
    email: "pj@ridgepartners.co",
    company: "Ridge Partners",
    role: "Head of creator launches",
    channel: "Email",
    website: "ridgepartners.co",
    relationship: "Creator Partner",
    status: "Needs reply",
    aiDescription:
      "Runs launch content for enterprise creators. Waiting on tracking link and referral code before Wednesday's launch post.",
    whoTheyAre:
      "PJ coordinates launches for a small stable of high-reach creators. Direct communicator, tight on operational detail.",
    relationshipContext:
      "Introduced by Krishna. First launch together — currently in launch prep.",
    stage: "Launch prep — awaiting assets from you",
    active: "needs follow-up",
    lastContacted: "2h ago",
    openThreads: 1,
    threads: [
      {
        subject: "Tracking link + referral code for launch",
        snippet: "Needs tracking link and referral code for Wednesday's launch post.",
        needsReplyFrom: "you",
        suggestedNext: "Generate tracking link and send referral code THEO25.",
      },
    ],
    suggestedNextAction: "Send the tracking link and referral code so PJ can finalize Wednesday's launch post.",
    communicationStyle: {
      tone: ["Direct", "Operational"],
      notes: "One-line replies work. Include links and codes in the same message.",
    },
    importantContext: [
      { label: "Referral code", value: "THEO25" },
      { label: "Tracking link", value: "superintern.ai/r/pj" },
      { label: "Deadlines", value: "Wednesday launch" },
      { label: "Risks", value: "Do not promise co-branded landing page yet." },
    ],
    uncertainties: ["Whether PJ's other creators are candidates for the program."],
    claims: [
      {
        text: "Launch post scheduled Wednesday.",
        sourceType: "email",
        observedDate: "2h ago",
        confidence: "high",
      },
    ],
  },
  {
    id: "max-herrera",
    name: "Max Herrera",
    email: "max@stackednorth.co",
    company: "Stacked North",
    role: "Operator, trial user",
    channel: "Email",
    relationship: "Product Access",
    status: "Access issue",
    aiDescription:
      "Signed up for SuperIntern but blocked on the Gmail OAuth screen. Sent a screenshot 8h ago.",
    whoTheyAre:
      "Runs ops at a small holding company. Patient and technical. Currently evaluating SuperIntern for his team.",
    relationshipContext:
      "Trial user brought in from a partner referral. Blocked before completing first setup.",
    stage: "Trial — blocked on access",
    active: "needs follow-up",
    lastContacted: "8h ago",
    openThreads: 1,
    threads: [
      {
        subject: "Can't log into SuperIntern",
        snippet: "Stuck on the Gmail OAuth screen — screenshot attached.",
        needsReplyFrom: "you",
        suggestedNext: "Escalate to support and confirm access is restored within 24h.",
      },
    ],
    suggestedNextAction: "Escalate the Gmail OAuth issue to support and reply with an ETA.",
    communicationStyle: {
      tone: ["Patient", "Technical"],
      notes: "Include steps and expected timing. Screenshots help.",
    },
    importantContext: [
      { label: "Product access", value: "Blocked — Gmail OAuth" },
      { label: "Deadlines", value: "Reply within 24h" },
      { label: "Risks", value: "Trial may lapse if unresolved this week." },
    ],
    uncertainties: ["Team size Max plans to bring on if trial converts."],
    claims: [
      {
        text: "OAuth screen fails on his account.",
        sourceType: "email",
        observedDate: "8h ago",
        confidence: "high",
      },
    ],
  },
  {
    id: "ana-rivera",
    name: "Ana Rivera",
    email: "ana@superintern.ai",
    company: "SuperIntern",
    role: "Marketing lead",
    channel: "Email · Slack",
    relationship: "Internal Team",
    status: "Active collaboration",
    aiDescription:
      "Owns the SuperIntern product story. Currently waiting on your feedback on the 90-second positioning cut.",
    whoTheyAre:
      "Ana leads marketing at SuperIntern and drives the positioning narrative. Collaborative and detail-oriented.",
    relationshipContext:
      "Cross-functional partner. You review her positioning drafts before team-wide share.",
    stage: "Positioning review",
    active: "active",
    lastContacted: "Today",
    openThreads: 1,
    threads: [
      {
        subject: "Feedback on new positioning video?",
        snippet: "Needs your review on the 90-second cut before the team meeting.",
        needsReplyFrom: "you",
        suggestedNext: "Watch and send 3 pieces of feedback before tomorrow's review.",
      },
    ],
    suggestedNextAction: "Send timestamped feedback on the 90s positioning cut before the team review.",
    communicationStyle: {
      tone: ["Friendly", "Collaborative"],
      notes: "Frame feedback around audience clarity, not personal taste.",
    },
    importantContext: [
      { label: "Video status", value: "90s cut pending your review" },
      { label: "Deadlines", value: "Team review tomorrow" },
    ],
    uncertainties: ["Whether the current CTA will change before publish."],
    claims: [
      {
        text: "Team-wide review scheduled tomorrow.",
        sourceType: "meeting",
        observedDate: "Today",
        confidence: "high",
      },
    ],
  },
  {
    id: "rina-alvarez",
    name: "Rina Alvarez",
    email: "rina@northlightco.com",
    company: "Northlight",
    role: "Partnerships",
    channel: "Email",
    website: "northlightco.com",
    relationship: "Sales Lead",
    status: "Waiting for them",
    aiDescription:
      "Exploring a co-marketing angle for Q1. Proposed 30 minutes next week — awaiting her preferred slot.",
    whoTheyAre:
      "Runs partnerships at Northlight. Professional, warm, and interested in shared referral programs.",
    relationshipContext:
      "Cold intro that warmed into a real conversation. Currently pre-intro-call stage.",
    stage: "Intro call scheduled",
    active: "active",
    lastContacted: "1d ago",
    openThreads: 1,
    threads: [
      {
        subject: "30 min next week?",
        snippet: "Proposed Tuesday or Wednesday afternoon for a co-marketing discussion.",
        needsReplyFrom: "them",
        suggestedNext: "Wait for her preferred slot; prepare partner deck.",
      },
    ],
    suggestedNextAction: "Prepare the partner deck ahead of Rina's intro call next week.",
    communicationStyle: {
      tone: ["Professional", "Warm"],
      notes: "Longer replies are welcome. Concrete numbers help.",
    },
    importantContext: [
      { label: "Deadlines", value: "Intro call next week" },
      { label: "Risks", value: "Don't commit to a shared referral program yet." },
    ],
    uncertainties: ["Their actual audience overlap with SuperIntern."],
    claims: [
      {
        text: "Northlight is exploring co-marketing for Q1.",
        sourceType: "email",
        observedDate: "1d ago",
        confidence: "medium",
      },
    ],
  },
  {
    id: "finance-superintern",
    name: "Finance @ SuperIntern",
    email: "finance@superintern.ai",
    company: "SuperIntern",
    role: "Finance operations",
    channel: "Email",
    relationship: "Finance",
    status: "Active collaboration",
    aiDescription:
      "Owns creator payment runs. Confirmed Thursday's run includes Krishna, Jade, and two others.",
    whoTheyAre:
      "Internal finance function. Concise and formal. Handles all creator payouts.",
    relationshipContext:
      "Always CC on payment threads with creators. No action required unless a run is delayed.",
    stage: "Ongoing operations",
    active: "active",
    lastContacted: "9h ago",
    openThreads: 0,
    threads: [],
    suggestedNextAction: "No action — reference Thursday's run when replying to Krishna and Jade.",
    communicationStyle: {
      tone: ["Concise", "Formal"],
      notes: "Keep replies factual. Include creator names and amounts.",
    },
    importantContext: [
      { label: "Payment status", value: "Thursday run includes Krishna, Jade + 2 others" },
      { label: "Risks", value: "Don't commit to same-day payments." },
    ],
    uncertainties: [],
    claims: [
      {
        text: "Thursday payment run is queued and confirmed.",
        sourceType: "email",
        observedDate: "9h ago",
        confidence: "high",
      },
    ],
  },
];
