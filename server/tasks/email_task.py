from crewai import Task

from agents.email_agent import email_agent


def create_email_task(product_context: str):
    return Task(
        description=f"""
Write a personalized B2B cold outreach email for the company.

The previous tasks provide:

1. Company sales analysis
2. Lead score, confidence, and scoring reasons

OUR PRODUCT / SERVICE:

{product_context}

Instructions:

- Use the previous analysis as the primary source of prospect information.
- Use the lead score and scoring reasons to understand the strongest
  sales opportunity.
- Personalize the email using only facts contained in the analysis.
- Connect a relevant company situation or opportunity to our
  product/service.
- Do not invent company facts, problems, initiatives, or buying intent.
- Never speculate about the prospect's internal situation, priorities,
  team behavior, or intentions.
- Do not use phrases such as "I imagine", "you may be looking",
  "you might be struggling", "your team is likely", or "you're probably".
- Do not claim that the prospect is actively looking for our solution
  unless explicitly stated in the analysis.
- Do not mention the lead score or confidence.
- Do not mention that AI was used.
- Avoid generic compliments.
- Avoid excessive flattery.
- Keep the email concise and natural.
- Use a professional conversational B2B tone.
- Include one clear call to action.
- Do not use fake statistics or unsupported claims.

Return ONLY the JSON object requested in the expected output.
""",

        expected_output="""
Return ONLY valid JSON:

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