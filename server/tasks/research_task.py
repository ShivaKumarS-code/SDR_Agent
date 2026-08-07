from crewai import Task

from agents.research_agent import research_agent


def create_research_task(company_name: str):
    return Task(
        description=f"""
Research the company "{company_name}".

Your objective is to gather enough information to create a concise and accurate company profile.

Guidelines:
- Use the Tavily search tool only when necessary.
- Minimize the number of searches performed.
- Prefer the company's official website and other trusted public sources.
- Avoid redundant searches.
- Stop searching once you have sufficient information.
- If a piece of information cannot be found, explicitly state "Not publicly available" instead of continuing to search.

Gather the following information:
- Company Overview
- Industry
- Products & Services
- Headquarters
- Approximate Company Size (if publicly available)
- Recent News (if available)
- Main Competitors
- Sources
""",
        expected_output="""
Produce a well-structured Markdown report with the following sections:

# Company Overview
# Industry
# Products & Services
# Headquarters
# Company Size
# Recent News
# Competitors
# Sources

Keep the report factual, concise, and based only on publicly available information.
""",
        agent=research_agent,
    )