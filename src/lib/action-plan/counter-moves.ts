/**
 * Counter-moves paired to each of the 12 Culture Toxins.
 *
 * Every counter-move includes a behavioral definition — one sentence that
 * defines what success looks like when the move is working. The behavioral
 * definition renders in a tooltip/expandable section on screen 2 and also
 * anchors the weekly check-in recurring-event agenda in the calendar.
 *
 * Shipping as final content — not placeholders.
 */

import type { ToxinId } from "./toxins";

export type CounterMove = {
  id: string;
  text: string;
  behavioralDefinition: string;
};

export const COUNTER_MOVES: Record<ToxinId, CounterMove[]> = {
  chronic_gossip: [
    {
      id: "no_triangulation",
      text: "Install a “no triangulation” rule — if you have a problem with someone, you address it with them directly.",
      behavioralDefinition:
        "Team members address issues directly with each other within 24 hours instead of complaining to others.",
    },
    {
      id: "issue_clearing",
      text: "Add a weekly issue-clearing segment to leadership meetings.",
      behavioralDefinition:
        "Each leadership meeting ends with open floor for anyone to raise an unresolved issue; issues are tracked to resolution.",
    },
    {
      id: "leader_models_direct_feedback",
      text: "Leader-modeled direct feedback: admit one mistake publicly this month.",
      behavioralDefinition:
        "A leader publicly names and owns a mistake within the next 30 days, giving the team permission to do the same.",
    },
  ],
  territorial_silos: [
    {
      id: "cross_department_standup",
      text: "Weekly cross-department standup with each team lead sharing priorities.",
      behavioralDefinition:
        "Every department head participates in a 30-minute standing weekly meeting where priorities and blockers are shared across lines.",
    },
    {
      id: "shared_okrs",
      text: "Shared OKRs across marketing, sales, and ops.",
      behavioralDefinition:
        "At least one quarterly objective is owned jointly by two or more departments, measured with the same metric by both sides.",
    },
    {
      id: "joint_project",
      text: "One joint project with shared ownership across two departments.",
      behavioralDefinition:
        "A single named project has co-owners from two departments; both names appear in every status update.",
    },
  ],
  overload_of_approvals: [
    {
      id: "delegated_authority_thresholds",
      text: "Delegated authority thresholds (e.g. team leads approve under $1,000 without escalation).",
      behavioralDefinition:
        "A written, shared threshold document exists; team leads reference it, and under-threshold approvals happen the same day.",
    },
    {
      id: "decision_rights_matrix",
      text: "Decision-rights matrix documented and shared.",
      behavioralDefinition:
        "Every recurring decision type has one documented owner; new team members can answer “who decides?” from the matrix, not by asking.",
    },
    {
      id: "default_to_yes",
      text: "“Default to yes” rule for low-risk decisions.",
      behavioralDefinition:
        "Leaders ask “what’s the worst case?” before asking “should we do it?”; low-risk asks get yes within 24 hours.",
    },
  ],
  high_turnover: [
    {
      id: "skip_level_1on1s",
      text: "Monthly skip-level 1:1s — leadership meets directly with frontline staff.",
      behavioralDefinition:
        "Each senior leader holds at least one 30-minute 1:1 per month with a frontline team member outside their direct reports.",
    },
    {
      id: "anonymous_feedback_loop",
      text: "Anonymous feedback loop with public leadership response.",
      behavioralDefinition:
        "A standing anonymous channel collects team feedback monthly; leadership posts a written response to every piece of feedback within 14 days.",
    },
    {
      id: "exit_interviews",
      text: "Exit interviews with every departure, findings shared with leadership team.",
      behavioralDefinition:
        "Every departing team member is offered a 30-minute exit interview; themes are summarized and reviewed with leadership within 30 days.",
    },
  ],
  no_ownership: [
    {
      id: "accountability_chart",
      text: "Accountability chart — each primary function has a single owner.",
      behavioralDefinition:
        "A current written chart maps every primary function to exactly one owner; any gap is visible and closed within 30 days.",
    },
    {
      id: "weekly_what_i_own",
      text: "Weekly “what I own this week” written commitment.",
      behavioralDefinition:
        "Every team member writes a short weekly note naming their three most important ownership items for the week.",
    },
    {
      id: "remove_someone_should",
      text: "Remove the phrase “someone should” from team language.",
      behavioralDefinition:
        "When “someone should” is spoken in a meeting, the facilitator names a single person and a deadline before moving on.",
    },
  ],
  fear_of_mistakes: [
    {
      id: "post_mortem_culture",
      text: "Post-mortem culture — normalize discussing mistakes without blame.",
      behavioralDefinition:
        "Every significant mistake triggers a blameless post-mortem within 7 days, documented, with at least one systemic lesson captured.",
    },
    {
      id: "leader_goes_first",
      text: "Leader goes first — publicly own a mistake and what they learned.",
      behavioralDefinition:
        "A leader names a personal mistake in a team-wide meeting within the next 30 days, including the concrete lesson that came from it.",
    },
    {
      id: "what_did_we_learn",
      text: "Replace “who caused this” with “what did we learn.”",
      behavioralDefinition:
        "When something goes wrong, the first leadership question is a systems question, not a person question, and the team notices the difference.",
    },
  ],
  leadership_blind_spots: [
    {
      id: "weekly_skip_level",
      text: "Weekly skip-level 1:1s with rotating frontline staff.",
      behavioralDefinition:
        "A senior leader holds a 30-minute 1:1 each week with a different frontline team member; insights are logged and acted on.",
    },
    {
      id: "state_of_the_team_survey",
      text: "Quarterly “state of the team” survey with public response.",
      behavioralDefinition:
        "Every quarter the team completes a short survey; leadership publishes what it heard and what it’s changing within 30 days.",
    },
    {
      id: "frontline_day",
      text: "Leaders spend one day per month in a frontline role.",
      behavioralDefinition:
        "Each senior leader spends at least one full day per month shadowing or working alongside a frontline team; observations are shared with leadership.",
    },
  ],
  micromanagement: [
    {
      id: "delegated_authority_micromanagement",
      text: "Delegated authority thresholds with clear decision rights.",
      behavioralDefinition:
        "Team members know the dollar/risk threshold below which they can decide without checking in; they use it consistently.",
    },
    {
      id: "tell_me_when_done",
      text: "Replace “check in with me” with “tell me when it’s done.”",
      behavioralDefinition:
        "Leaders stop requesting mid-flight status updates on delegated work; they wait for completion and trust the interim.",
    },
    {
      id: "leader_asks_first",
      text: "Leader commits to asking “what do you think?” before giving their answer.",
      behavioralDefinition:
        "In the next 10 decisions, the leader lets the team member answer first every time; the team member notices the change.",
    },
  ],
  unclear_authority: [
    {
      id: "accountability_chart_unclear",
      text: "Accountability chart documenting every role and responsibility.",
      behavioralDefinition:
        "A shared document names who owns what for every recurring responsibility; any new hire can orient themselves using it alone.",
    },
    {
      id: "simple_org_chart",
      text: "Simple org chart with specific competencies named.",
      behavioralDefinition:
        "The org chart shows not just titles but the 2–3 specific competencies each role owns; the team references it in project kickoffs.",
    },
    {
      id: "who_owns_what_kickoff",
      text: "Weekly “who owns what” clarity in every project kickoff.",
      behavioralDefinition:
        "Every new project kickoff ends with a written one-liner naming the owner, the decision-maker, and the deliverable.",
    },
  ],
  fear_of_conflict: [
    {
      id: "disagreements_segment",
      text: "Weekly “disagreements” segment in leadership meetings.",
      behavioralDefinition:
        "Every leadership meeting includes a named 10-minute slot where anyone surfaces a current disagreement; silence in that slot is itself a signal.",
    },
    {
      id: "dissent_check",
      text: "Norm that every meeting decision gets a dissent check before closing.",
      behavioralDefinition:
        "Before any group decision is finalized, the facilitator asks “who disagrees?” and waits long enough for someone to speak.",
    },
    {
      id: "thanks_for_disagreeing",
      text: "Leader publicly thanks someone for disagreeing with them.",
      behavioralDefinition:
        "Within the next 30 days, a leader publicly acknowledges a team member who pushed back, naming what the pushback improved.",
    },
  ],
  poor_accountability: [
    {
      id: "weekly_scorecard_review",
      text: "Weekly scorecard review with dates, numbers, and owners.",
      behavioralDefinition:
        "Every leader reviews a weekly scorecard with 5–7 metrics and named owners; misses are discussed, not skipped.",
    },
    {
      id: "consequences_documented",
      text: "Consequences documented — promotion, stagnation, or separation.",
      behavioralDefinition:
        "A written performance framework exists and is applied; missed commitments produce visible consequences within a defined window.",
    },
    {
      id: "leaders_hold_each_other",
      text: "Leaders hold each other accountable before holding the team accountable.",
      behavioralDefinition:
        "The leadership team addresses misses within itself first; team members can point to a specific example of this happening in public.",
    },
  ],
  hero_culture: [
    {
      id: "cross_training",
      text: "Cross-training so no single person is the only one who can do a critical task.",
      behavioralDefinition:
        "Every critical task has at least two people trained to execute it; the primary owner can take a week off without rescue required.",
    },
    {
      id: "recognize_systems",
      text: "Recognize systems and teams publicly, not just individual rescues.",
      behavioralDefinition:
        "Public recognition shifts over 30 days from late-night-save stories toward stories about systems that prevented a fire.",
    },
    {
      id: "pay_down_hero_debt",
      text: "Pay down “hero debt” — hire or train to remove the bottleneck.",
      behavioralDefinition:
        "The two people most relied on for last-minute rescues have a named plan to transfer at least one critical responsibility within 90 days.",
    },
  ],
};

export function counterMovesFor(toxin: ToxinId): CounterMove[] {
  return COUNTER_MOVES[toxin];
}

export function counterMoveById(
  toxin: ToxinId,
  moveId: string
): CounterMove | undefined {
  return COUNTER_MOVES[toxin]?.find((m) => m.id === moveId);
}
