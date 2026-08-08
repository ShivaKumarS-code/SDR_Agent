from crewai import Task

from agents.analysis_agent import analysis_agent


def create_analysis_task():
    return Task(
        description="""
Analyze the company research provided by the previous task.

Transform the raw research into concise, actionable sales intelligence
for downstream lead scoring and outreach.

Using ONLY the provided research, identify:

- Company Summary
- Business Challenges
- Potential Pain Points
- Business Opportunities
- Ideal Decision Makers
- Buying Signals
- Personalization Facts
- Best Outreach Angle

Instructions:

- Base every conclusion on information from the research.
- Do not invent facts, problems, initiatives, priorities, or buying intent.
- Do not assume a problem simply because it is common in the company's industry.
- Clearly distinguish reasonable inferences from established facts.
- If there is insufficient evidence, say so.
- Preserve important factual details that may be useful for lead scoring
  or email personalization.
- Do not repeat the entire research report.
- Prioritize concise, actionable sales intelligence.
""",

expected_output="""
A concise structured Markdown report.

# Company Summary
2-3 sentences.

# Business Challenges
Up to 3 evidence-based points.

# Pain Points
Up to 3 evidence-based points.

# Opportunities
Up to 3 evidence-based points.

# Decision Makers
Relevant roles only when supported by the research.

# Buying Signals
Only explicitly supported signals.

# Personalization Facts
3-5 useful facts for outreach.

# Outreach Angle
One specific, evidence-based angle.

Do not repeat the research.
Keep the entire response under 700 words.
""",

        agent=analysis_agent,
    )