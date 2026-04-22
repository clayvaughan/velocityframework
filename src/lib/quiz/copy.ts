/**
 * Culture Health Check — final results copy.
 *
 * Tier treatments (per spec, not browser dark mode):
 *   Healthy  → LIGHT card (cream bg, slate text, harvest gold accent)
 *   At Risk  → DARK card (slate bg, cream text, harvest gold accent)
 *   Critical → DARK card (slate bg, cream text, harvest gold accent)
 *
 * All copy is Clay-approved final content — ships as-is.
 */

import type { Dimension } from "./questions";

export type Tier = "healthy" | "at_risk" | "critical";

export const TIER_LABEL: Record<Tier, string> = {
  healthy: "Healthy",
  at_risk: "At Risk",
  critical: "Critical",
};

/**
 * Surface treatment for the ResultsTier card and PDF cover. Drives
 * background / text / accent choices.
 */
export const TIER_SURFACE: Record<Tier, "light" | "dark"> = {
  healthy: "light",
  at_risk: "dark",
  critical: "dark",
};

export const TIER_OVERALL: Record<Tier, { headline: string; body: string }> = {
  healthy: {
    headline: "Your culture is in a strong place.",
    body: "The foundation is there. Most teams don't get here — and those that do, lose it by taking it for granted. Your job now is to protect it.",
  },
  at_risk: {
    headline: "Your culture has real strengths and real risks.",
    body: "You're not broken. But there are toxins sneaking in, and they compound fast. The good news: the team members who answered this honestly are telling you exactly where to focus. Act on it in the next 30 days and you'll feel the shift.",
  },
  critical: {
    headline: "Your culture needs urgent attention.",
    body: "This is not a slow leak — it's a fire. But here's the truth: every team that's ever turned a culture around started exactly where you are right now. The framework below shows you what to do, and in what order. You can fix this.",
  },
};

export const DIMENSION_COPY: Record<
  Dimension,
  Record<Tier, { interpretation: string; nextStep: string }>
> = {
  trust: {
    healthy: {
      interpretation:
        "People on your team believe each other and believe you. That's rarer than you think. Trust is what lets your team move fast without double-checking every decision. The risk here is complacency — people assume trust will always be there. Keep the habits that built it: transparent decisions, consistent follow-through, and leaders who admit when they're wrong.",
      nextStep:
        "Name one trust-building habit your team does well. Write it down. Reinforce it publicly at your next team meeting.",
    },
    at_risk: {
      interpretation:
        "Trust exists on your team, but it's fragile. Some people feel safe to speak up; others are calculating whether it's worth it. That's the mode that slowly breaks teams. Identify who isn't speaking up — and ask yourself whether the room is actually safe for them.",
      nextStep:
        "In your next one-on-one with each direct report, ask: 'What's something you've been meaning to raise but haven't?' Listen without defending. Fix one thing they name within 30 days.",
    },
    critical: {
      interpretation:
        "Your team doesn't feel safe. People are managing up, protecting themselves, or quietly disengaging. This is the toxin Clay writes about in Velocity — the one that kills companies from the inside before any external threat has a chance. You can't strategy your way out of this. You rebuild trust with actions, not announcements.",
      nextStep:
        "Stop what you're doing this week and have honest, one-on-one conversations with each leadership team member. Ask what's broken. Don't defend. Don't fix in the meeting. Just listen, write it down, and circle back within two weeks with what you heard and what you're going to do.",
    },
  },
  communication: {
    healthy: {
      interpretation:
        "Your team has the muscle for real conversations. People say what they mean, disagreements surface early, and meetings produce decisions. This is the exception in most businesses. Don't let new hires dilute it — train them into it from day one.",
      nextStep:
        "Pick one recent team conflict that resolved well. Write down what made it work. Use that as a teaching moment the next time you onboard someone new.",
    },
    at_risk: {
      interpretation:
        "People communicate on your team, but too much of it is sideways — through Slack, through hallway chats, through complaints to the wrong person. That's a sign that direct conversations feel risky. Meetings might be producing activity without real decisions.",
      nextStep:
        "At your next team meeting, end with one question: 'Did we make any actual decisions today, or did we just talk?' Make decision-tracking part of every meeting from now on.",
    },
    critical: {
      interpretation:
        "Your team is not talking to each other — they're talking around each other. Gossip is the unofficial communication system. That's corrosive, and it accelerates. Start fixing this by modeling directness yourself, then make it the expectation.",
      nextStep:
        "When someone comes to you with a complaint about a coworker, ask: 'Have you told them?' If they haven't, coach them to do it. If the culture punishes directness, name that openly and commit to changing it starting with your own behavior.",
    },
  },
  accountability: {
    healthy: {
      interpretation:
        "People on your team know what they own, and when they miss, it gets addressed. That's hard to build and easy to lose. The biggest threat to your accountability is growth — new roles, new hires, and unclear handoffs dilute it. Stay specific about who owns what.",
      nextStep:
        "Pull up your org chart this week. For each person, write one sentence: 'They specifically own ___.' If you can't, they don't actually own it yet. Fix that before you hire anyone else.",
    },
    at_risk: {
      interpretation:
        "Accountability on your team is inconsistent. Some people have clear ownership; others live in gray zones. Some underperformance gets addressed; some lingers. That inconsistency is the real problem — it signals to everyone that standards are negotiable.",
      nextStep:
        "Identify one person on your team who's been underperforming without consequences. Have the conversation you've been avoiding. Give them clarity on what needs to change and a specific timeline. Either they rise to it or you make the harder decision — both outcomes are better than the current limbo.",
    },
    critical: {
      interpretation:
        "Your team has accountability on paper, not in practice. Commitments slip, underperformance is tolerated, and the high performers are carrying the weight. They'll leave first. The fix isn't more rules — it's fewer excuses, starting at the top.",
      nextStep:
        "List the three people on your leadership team. Next to each, write the one thing they own that hasn't been getting done. Have those three conversations this week. You set the standard by what you tolerate.",
    },
  },
  purpose_alignment: {
    healthy: {
      interpretation:
        "Your team knows why the work matters. That's a competitive advantage — purpose-aligned teams endure through the hard seasons. Keep reinforcing the why. The moment leaders stop telling the story, the team starts forgetting it.",
      nextStep:
        "At your next all-hands, tell one story — a specific customer, a specific outcome, a specific moment — that illustrates why the work matters. Then ask the team for their own stories. Make this a monthly rhythm.",
    },
    at_risk: {
      interpretation:
        "Your team understands the mission, but it's not pulling them. Purpose has become abstract — values on a wall instead of a lived reality. People are showing up for the paycheck, not the meaning. That's fixable, but only by leaders who genuinely believe the mission themselves.",
      nextStep:
        "Write down your company's mission in one sentence. Now ask three team members to do the same, separately. Compare. If the answers diverge, you have a clarity problem, not a culture problem — and you fix it by repeating the real mission until it sticks.",
    },
    critical: {
      interpretation:
        "Your team can't explain why your company exists beyond making money. That's a five-alarm signal. People don't stay for pay alone, and they won't go above-and-beyond for a mission they can't name. The question isn't whether your mission is clear to you — it's whether it's clear to them.",
      nextStep:
        "Hold a 90-minute leadership team meeting this month with one agenda item: 'What do we actually exist to do, and how would we prove it to a skeptic?' Come out with a single sentence you can all repeat. Then repeat it everywhere — every meeting, every email, every onboarding — for the next quarter.",
    },
  },
  hospitality: {
    healthy: {
      interpretation:
        "Your team treats people — each other and clients — with genuine care. That's a real edge in a commodity world. Hospitality is what turns customers into advocates and employees into evangelists. Keep rewarding and celebrating the small gestures that create it.",
      nextStep:
        "Find one person on your team who did something hospitable in the last two weeks — a small, generous gesture — and publicly acknowledge it. Make that recognition a weekly habit.",
    },
    at_risk: {
      interpretation:
        "Your team is professional but not warm. You're delivering the service, but not the experience. Clients notice. Teammates notice. The difference between 'fine' and 'memorable' is almost always hospitality — and it starts with how you treat each other.",
      nextStep:
        "Do one unexpected act of hospitality this week for a client or team member — a handwritten note, a small gift, a personal check-in. Make it specific to them, not a template. Then do another one next week.",
    },
    critical: {
      interpretation:
        "Your culture is transactional. People do what's required, nothing more, and the warmth has drained out. Clients are probably already feeling it — you'll see it in referrals, reviews, and retention before it shows up in revenue. Hospitality is leader-modeled: if you're not doing it, no one else will.",
      nextStep:
        "This week, make one small gesture of genuine care for someone on your team — not a review, not a meeting, just a specific, personal act of hospitality. Watch how it shifts the room. Then build a weekly rhythm of doing something hospitable for someone on the team.",
    },
  },
};
