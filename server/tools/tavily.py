from crewai_tools import TavilySearchTool

tavily_tool = TavilySearchTool(
    max_results=2,
    search_depth="basic"
)