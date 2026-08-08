import litellm
from crewai import LLM
from core.config import settings
import crewai.llms.cache as _crewai_cache

_crewai_cache.mark_cache_breakpoint = lambda msg: msg

# litellm handles retries on rate-limit (429) errors automatically.
litellm.num_retries = 5


def get_llm(model: str):
    """Create an LLM instance.

    Supports both Groq and Cerebras providers.
    Prefix models with 'cerebras/' to use Cerebras,
    or 'groq/' to use Groq.
    """
    if model.startswith("cerebras/"):
        api_key = settings.CEREBRAS_API_KEY
    else:
        api_key = settings.GROQ_API_KEY

    return LLM(
        model=model,
        api_key=api_key,
        temperature=0.2,
        max_completion_tokens=4096,
    )