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
    company_context: str,
):
    research_task = create_research_task(company)

    analysis_task = create_analysis_task()

    lead_scoring_task = create_lead_scoring_task(
        product_context=company_context
    )

    email_task = create_email_task(
        product_context=company_context
    )

    # Only pass the information each stage actually needs.
    analysis_task.context = [
        research_task,
    ]

    lead_scoring_task.context = [
        analysis_task,
    ]

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

    return crew.kickoff()