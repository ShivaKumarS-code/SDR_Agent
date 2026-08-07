from crewai import LLM
from core.config import settings
import crewai.llms.cache as _crewai_cache

_crewai_cache.mark_cache_breakpoint = lambda msg: msg

def get_llm():
    return LLM(
        model="groq/llama-3.3-70b-versatile",
        api_key=settings.GROQ_API_KEY,
        temperature=0.2,
    )