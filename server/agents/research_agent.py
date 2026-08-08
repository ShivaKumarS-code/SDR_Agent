from crewai import Agent

from tools.tavily import tavily_tool

from core.llm import get_llm

research_agent = Agent(
    role="Company Research Specialist",

    goal="""
    Gather accurate and up-to-date information about companies.
    """,

    backstory="""
    You are an experienced market researcher.
    Your job is to research companies using trusted web sources.
    Focus on factual information instead of making assumptions.
    """,
   
    llm=get_llm("cerebras/gpt-oss-120b"),

    max_iter = 4,
    
    tools=[tavily_tool],

    verbose=True,
)