from crewai import Task

from agents.email_agent import email_agent


def create_email_task(
    research: str,
    analysis: str,
    score: int,
    confidence: str,
    reasons: list[str],
    product_context: str,
):
    return Task(
        description=f"""
Write a personalized B2B cold outreach email for the company
described below.

COMPANY RESEARCH:
{research}

COMPANY ANALYSIS:
{analysis}

LEAD SCORE:
{score}/100

LEAD CONFIDENCE:
{confidence}

LEAD SCORING REASONS:
{reasons}

OUR PRODUCT / SERVICE:
{product_context}

Instructions:

- Write a concise B2B cold outreach email.
- Personalize the email using only facts from the provided research
  and analysis.
- Connect a relevant company situation or opportunity to our
  product/service.
- Do not invent company facts, problems, initiatives, or buying intent.
- Never speculate about the prospect's internal situation, priorities,
  team behavior, or intentions.
- Do not use phrases such as "I imagine", "you may be looking",
  "you might be struggling", "your team is likely", or
  "you're probably".
- Do not claim that the prospect is actively looking for our solution
  unless explicitly stated in the provided information.
- Do not mention the lead score or confidence.
- Do not mention that AI was used.
- Avoid generic compliments.
- Avoid excessive flattery.
- Keep the email concise and natural.
- Use a professional but conversational B2B tone.
- Include one clear call to action.
- Do not use fake statistics or unsupported claims.

Return ONLY the JSON object requested in the expected output.
""",

        expected_output="""
Return ONLY valid JSON.

{
    "subject": "A concise personalized subject line",
    "body": "The complete outreach email"
}

Do not wrap the JSON in Markdown.
Do not include ```json.
Do not include any explanation outside the JSON.
""",

        agent=email_agent,
    )