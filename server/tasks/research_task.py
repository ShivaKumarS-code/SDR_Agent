from crewai import Task

from agents.research_agent import research_agent


def create_research_task(company: str):
    return Task(
        description=f"""
Research the company '{company}'.

Find the most useful information for a B2B sales workflow:

- Company overview
- Industry
- Products and services
- Headquarters
- Approximate company size
- Recent relevant news or developments
- Key competitors
- Interesting facts
- Important sources

Research strategy:

- Use Tavily only when necessary.
- Use a maximum of 3 searches.
- Combine multiple information requirements into the same search whenever
  possible.
- Do not perform another search for information that is already available
  from previous results.
- Stop searching once enough reliable information has been gathered.
- Prioritize trustworthy and relevant sources.
- Prefer primary sources and reputable publications when available.
- Do not repeatedly search for the same company information.
- Do not invent facts.
- If reliable information cannot be found, state that clearly.

The goal is to produce a concise factual research report, not an exhaustive
investigation.
""",

        expected_output="""
A concise Markdown research report containing:

# Company Overview

# Industry

# Products & Services

# Headquarters

# Company Size

# Recent Developments

# Competitors

# Interesting Facts

# Sources

Keep the report concise and include only information useful for
understanding and selling to the company.
""",

        agent=research_agent,
    )