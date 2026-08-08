from crewai import Crew, Process

from agents.research_agent import research_agent
from tasks.research_task import create_research_task


def run_research(company_name: str):
    task = create_research_task(company_name)

    crew = Crew(
        agents=[research_agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()

    return result
