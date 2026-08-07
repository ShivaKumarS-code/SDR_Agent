from crewai import Task

from agents.analysis_agent import analysis_agent


def create_analysis_task(research: str):
    return Task(
        description=f"""
Analyze the following company research.

Research Report:

{research}

Using ONLY the information provided above, perform a business analysis.

Instructions:
- Do NOT perform any web searches.
- Do NOT invent facts or make unsupported assumptions.
- Base every conclusion on the research provided.
- Avoid generic business or sales advice.
- If there is insufficient information to determine something, explicitly state:
  "Insufficient information to determine."

Identify the following:

- Company Summary
- Potential Business Challenges
- Potential Customer Pain Points
- Business Opportunities
- Ideal Decision Makers
- Buying Signals
- Recommended Outreach Angle
""",

        expected_output="""
Produce a concise, well-structured Markdown report with the following sections:

# Company Summary
Provide a brief summary of the company.

# Business Challenges
List only challenges that can reasonably be inferred from the research.

# Potential Customer Pain Points
Describe the problems the company's customers are likely trying to solve based on its products or services.

# Business Opportunities
Identify opportunities supported by the research.

# Decision Makers
List the roles that are most likely to influence purchasing decisions.
If uncertain, state that there is insufficient information.

# Buying Signals
Highlight any indicators suggesting the company may be open to purchasing or expanding solutions.
If none are evident, state that.

# Recommended Outreach Angle
Suggest one personalized outreach angle based only on the research.
Do not include a full email.
""",

        agent=analysis_agent,
    )