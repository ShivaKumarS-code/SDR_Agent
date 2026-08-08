from crewai import Task

from agents.lead_scoring_agent import lead_scoring_agent
from agents.models.lead_score import LeadScoreOutput


def create_lead_scoring_task(product_context: str):
    return Task(
        description=f"""
Evaluate the company as a potential sales lead.

The previous task contains the company's sales analysis.

OUR PRODUCT / SERVICE:

{product_context}

Score the lead from 0 to 100 based on:

- Fit between the company and our product/service
- Business opportunities relevant to our offering
- Buying signals
- Potential value of the lead

Instructions:

- Use ONLY the previous analysis and the provided product context.
- Do not perform web searches.
- Do not invent facts or unsupported information.
- Do not assume buying intent without evidence.
- Every reason must be supported by the provided analysis.
- Do not infer financial capability or purchasing ability without evidence.
- If buying signals are unavailable, reflect that primarily in confidence.
- Evaluate company fit specifically against the provided product context.
- If there is insufficient information, state that rather than guessing.
- Keep the score consistent with the available evidence.
- Give concise reasons supporting the score.
""",

        expected_output="""
A structured lead evaluation containing:

- Score from 0 to 100
- Confidence: Low, Medium, or High
- A list of concise reasons supporting the score
""",

        output_pydantic=LeadScoreOutput,

        agent=lead_scoring_agent,
    )