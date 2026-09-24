export interface FaqItem {
  q: string;
  a: string;
  category: "General" | "Reporting" | "Tracking" | "Privacy & Data" | "Coverage";
}

export const FAQS: FaqItem[] = [
  {
    category: "General",
    q: "Is PowerCut an official utility service?",
    a: "No. PowerCut is an independent, community-driven platform. It has no affiliation with any government agency, DISCOM, or electricity provider.",
  },
  {
    category: "General",
    q: "How accurate are the reports?",
    a: "Reports are submitted directly by users and are not independently verified. They may be incomplete, delayed, inaccurate, or unavailable for any given area or time.",
  },
  {
    category: "General",
    q: "What's the difference between \"Reported,\" \"Ongoing,\" and \"Restored\" status?",
    a: '"Reported" means a single fresh report with no confirmations yet. "Ongoing" means at least one neighbor has confirmed the outage is still happening. "Restored" means enough confirmations came in that power is back, which happens automatically.',
  },
  {
    category: "Reporting",
    q: "Do I need an account to report an outage?",
    a: "No. Reporting is anonymous and does not require sign-up.",
  },
  {
    category: "Reporting",
    q: "How is a report marked as restored?",
    a: 'When enough users in the area confirm that power is back, the report status automatically updates to "restored".',
  },
  {
    category: "Reporting",
    q: "Can I report on behalf of someone else's area?",
    a: "You can report any valid PIN code, but please only submit reports for outages you can confirm are actually happening, to keep the data useful for everyone.",
  },
  {
    category: "Tracking",
    q: "What is the complaint reference number for?",
    a: "Every report you submit gets a unique reference number (e.g. PCT-2026-XXXXXXXX). Save it to look up that report's status later on the Track Complaint page, without needing an account.",
  },
  {
    category: "Tracking",
    q: "Can I track a report someone else submitted?",
    a: "Yes — if they share the reference number with you, anyone can look up that report's status. No personal information is tied to it.",
  },
  {
    category: "Privacy & Data",
    q: "Is my personal data sold or shared with anyone?",
    a: "No. Reports don't collect names, emails, or phone numbers. We store only a one-way cryptographic hash of the submitting device's IP address, used solely to prevent spam, and it is never sold or shared.",
  },
  {
    category: "Coverage",
    q: "Why is there no data for my PIN code?",
    a: "Coverage depends on community participation. If no one nearby has reported yet, there won't be any data — you can be the first.",
  },
  {
    category: "Coverage",
    q: "Which cities and states does PowerCut cover?",
    a: "Any valid 6-digit Indian PIN code can be tracked. Dedicated district directories are available for major metros (Mumbai, New Delhi, North Delhi, South Delhi, Bangalore, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad) and every Indian state and union territory.",
  },
];
