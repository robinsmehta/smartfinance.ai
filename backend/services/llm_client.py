import os
import time
from collections import deque
from typing import Deque, Dict, Any

import requests


# Simple in-memory rate limiter: 10 RPM for GPT-5.4
_MAX_REQUESTS_PER_MINUTE = 10
_WINDOW_SECONDS = 60
_request_timestamps: Deque[float] = deque()


class RateLimitError(Exception):
    pass


def _check_rate_limit() -> None:
    now = time.time()
    # Drop timestamps older than the window
    while _request_timestamps and now - _request_timestamps[0] > _WINDOW_SECONDS:
        _request_timestamps.popleft()

    if len(_request_timestamps) >= _MAX_REQUESTS_PER_MINUTE:
        raise RateLimitError("Local GPT-5.4 rate limit exceeded (10 requests per minute)")

    _request_timestamps.append(now)


def chat_completion(messages: list[Dict[str, str]]) -> str:
    """Call Nexalaris GPT-5.4 chat endpoint and return the assistant reply.

    Expects environment variables:
      NEXALARIS_API_KEY
      NEXALARIS_OPENAI_ENDPOINT (e.g. https://nexalaris-tech.openai.azure.com)
      NEXALARIS_GPT54_DEPLOYMENT (e.g. gpt-5.4)
    """
    _check_rate_limit()

    api_key = os.environ.get("NEXALARIS_API_KEY")
    endpoint = os.environ.get("NEXALARIS_OPENAI_ENDPOINT")
    deployment = os.environ.get("NEXALARIS_GPT54_DEPLOYMENT", "gpt-5.4")

    if not api_key or not endpoint:
        raise RuntimeError("Nexalaris API is not configured. Set NEXALARIS_API_KEY and NEXALARIS_OPENAI_ENDPOINT.")

    url = f"{endpoint}/openai/deployments/{deployment}/chat/completions?api-version=2024-02-15-preview"

    headers = {
        "Content-Type": "application/json",
        "api-key": api_key,
    }

    payload: Dict[str, Any] = {
        "model": deployment,
        "messages": messages,
        "temperature": 0.4,
        "max_tokens": 512,
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=30)

    if resp.status_code == 429:
        raise RateLimitError("Received 429 from Nexalaris GPT-5.4 endpoint")

    if not resp.ok:
        raise RuntimeError(f"Nexalaris GPT-5.4 error: {resp.status_code} {resp.text}")

    data = resp.json()
    # Azure OpenAI style response
    try:
        return data["choices"][0]["message"]["content"]  # type: ignore[index]
    except Exception as exc:  # pragma: no cover - defensive
        raise RuntimeError("Unexpected response format from GPT-5.4") from exc
