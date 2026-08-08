import json

from crewai import Crew, Process

from agents.research_agent import research_agent
from agents.analysis_agent import analysis_agent
from agents.lead_scoring_agent import lead_scoring_agent
from agents.email_agent import email_agent

from tasks.research_task import create_research_task
from tasks.analysis_task import create_analysis_task
from tasks.lead_scoring_task import create_lead_scoring_task
from tasks.email_task import create_email_task


def run_sdr_pipeline(
    company: str,
    product_context: str,
):
    research_task = create_research_task(company)

    analysis_task = create_analysis_task()

    lead_scoring_task = create_lead_scoring_task(
        product_context=product_context
    )

    email_task = create_email_task(
        product_context=product_context
    )

    analysis_task.context = [research_task]

    lead_scoring_task.context = [analysis_task]

    email_task.context = [
        analysis_task,
        lead_scoring_task,
    ]

    crew = Crew(
        agents=[
            research_agent,
            analysis_agent,
            lead_scoring_agent,
            email_agent,
        ],
        tasks=[
            research_task,
            analysis_task,
            lead_scoring_task,
            email_task,
        ],
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()

    email = json.loads(result.tasks_output[3].raw)

    return {
        "research": result.tasks_output[0].raw,
        "analysis": result.tasks_output[1].raw,
        "lead_score": result.tasks_output[2].pydantic,
        "email": email,
    }