from crewai import Task

from agents.lead_scoring_agent import lead_scoring_agent
from agents.models.lead_score import LeadScoreOutput


def create_lead_scoring_task(
    research: str,
    analysis: str,
    product_context: str,
):
    return Task(
        description=f"""
Evaluate the following company as a potential sales lead.

COMPANY RESEARCH:
{research}

COMPANY ANALYSIS:
{analysis}

SALES CONTEXT:
{product_context}

Score the lead from 0 to 100 based on:

- Fit between the company and our product/service
- Business opportunities relevant to our offering
- Buying signals
- Potential value of the lead

Instructions:

- Use ONLY the provided research, analysis, and sales context.
- Do not perform web searches.
- Do not invent facts or unsupported information.
- Do not assume buying intent without evidence.
- Every reason must be directly supported by the provided information.
- Do not infer financial capability, purchasing ability, or operational
  limitations from company size or revenue alone.
- Do not treat the absence of recent news or buying signals as proof
  that the company is a poor lead.
- If buying signals are unavailable, reflect that primarily in the
  confidence level rather than automatically lowering the score.
- Evaluate company fit specifically against the provided sales context.
- If there is insufficient information to determine a factor, state that
  rather than making an assumption.
- Give higher scores only when the available evidence supports them.
- Give lower scores when there is clear evidence that the company is
  a poor fit for our offering.
- Keep the score consistent with the evidence provided.
- Explain the main factors behind the score using concise reasons.
""",

        expected_output="""
A structured lead evaluation containing:

- Score from 0 to 100
- Confidence: Low, Medium, or High
- A list of concise reasons directly supported by the provided
  research, analysis, or sales context
""",

        output_pydantic=LeadScoreOutput,

        agent=lead_scoring_agent,
    )