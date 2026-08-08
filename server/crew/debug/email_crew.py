from crewai import Crew, Process

from agents.email_agent import email_agent
from tasks.email_task import create_email_task
import json


def run_email(
    research: str,
    analysis: str,
    score: int,
    confidence: str,
    reasons: list[str],
    product_context: str,
):
    task = create_email_task(
        research=research,
        analysis=analysis,
        score=score,
        confidence=confidence,
        reasons=reasons,
        product_context=product_context,
    )

    crew = Crew(
        agents=[email_agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()

    return json.loads(result.raw)
