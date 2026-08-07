from crewai import Crew, Process

from agents.analysis_agent import analysis_agent
from tasks.analysis_task import create_analysis_task


def run_analysis(research: str):

    task = create_analysis_task(research)

    crew = Crew(
        agents=[analysis_agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()

    return result