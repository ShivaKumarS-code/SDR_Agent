from crewai import Crew, Process

from agents.lead_scoring_agent import lead_scoring_agent
from tasks.lead_scoring_task import create_lead_scoring_task


def run_lead_scoring(
    research: str,
    analysis: str,
    product_context: str,
):
    task = create_lead_scoring_task(
        research,
        analysis,
        product_context,
    )

    crew = Crew(
        agents=[lead_scoring_agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()

    return result
