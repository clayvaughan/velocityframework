/**
 * Facilitator guide — page 5 of the individual PDF and page 6 of the team
 * PDF. Same guide in both modes. Clay-approved final copy.
 */

export const FACILITATOR_GUIDE = {
  title: "How to use this with your leadership team",
  intro:
    "This report is most valuable when it becomes a conversation, not a file. Here's how to run that conversation with your leadership team in 60–90 minutes.",
  sections: [
    {
      heading: "Before the meeting (10 minutes of prep)",
      body: "Read the report once on your own. Don't strategize yet. Just notice your reactions. Which dimension surprised you? Which one feels accurate but uncomfortable? Those are the ones worth discussing. Share the report with your leadership team 48 hours before the meeting. Ask them to read it and come ready with one question. Don't ask them to solve anything yet.",
    },
    {
      heading: "In the meeting — work through three questions in order",
      body: "Run the three questions below in sequence. Don't jump ahead.",
      questions: [
        "What does this tell us about where we actually are? (15–20 minutes — resist the urge to defend or explain; just describe what you see.)",
        "What's one thing in this report that, if it stayed true, would hurt us in the next year? (20–30 minutes — this is where you identify the one or two risks worth investing in.)",
        "What will we do in the next 30 days — specifically, with names and dates? (20–30 minutes — leave with no more than 3 commitments. More than that and none will happen.)",
      ],
    },
    {
      heading: "What not to do",
      body: "Don't turn this into a performance review of specific people. Don't try to fix all five dimensions in one meeting. Don't let the team get defensive — your job as the leader is to go first with humility.",
    },
    {
      heading: "The goal",
      body: "The goal isn't to get a perfect score next time. The goal is to pick one thing that matters, fix it, and feel the difference on your team. Then come back and do the next one.",
    },
  ],
} as const;
