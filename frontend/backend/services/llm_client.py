import os
import time
from collections import deque
from typing import Deque, Dict, Any, List, Optional

import requests


# Rate limits based on Nexalaris Tech policy
_RPM_LIMITS = {
    "gpt-5.4": 10,
    "gpt-image-1.5": 3
}
_WINDOW_SECONDS = 60
_request_timestamps: Dict[str, Deque[float]] = {
    "gpt-5.4": deque(),
    "gpt-image-1.5": deque()
}


class RateLimitError(Exception):
    pass


def _check_rate_limit(model: str) -> None:
    if model not in _RPM_LIMITS:
        return

    now = time.time()
    if model not in _request_timestamps:
        _request_timestamps[model] = deque()
        
    timestamps = _request_timestamps[model]
    limit = _RPM_LIMITS[model]

    # Drop timestamps older than the window
    while timestamps and now - timestamps[0] > _WINDOW_SECONDS:
        timestamps.popleft()

    if len(timestamps) >= limit:
        raise RateLimitError(f"Local {model} rate limit exceeded ({limit} requests per minute)")

    timestamps.append(now)


def chat_completion(messages: List[Dict[str, Any]], model: str = "gpt-5.4") -> str:
    """Call Nexalaris GPT-5.4 or gpt-audio-1.5 chat endpoint."""
    _check_rate_limit(model)

    api_key = os.environ.get("NEXALARIS_API_KEY")
    endpoint = os.environ.get("NEXALARIS_OPENAI_ENDPOINT")
    
    if not api_key or not endpoint:
        raise RuntimeError("Nexalaris API is not configured. Set NEXALARIS_API_KEY and NEXALARIS_OPENAI_ENDPOINT.")

    # Deployment names: gpt-5.4, gpt-audio-1.5
    url = f"{endpoint.rstrip('/')}/openai/deployments/{model}/chat/completions?api-version=2024-02-15-preview"

    headers = {
        "Content-Type": "application/json",
        "api-key": api_key,
    }

    payload: Dict[str, Any] = {
        "messages": messages,
        "max_completion_tokens": 1024,
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=30)

    if resp.status_code == 429:
        raise RateLimitError(f"Received 429 from Nexalaris {model} endpoint")

    if not resp.ok:
        print(f"DEBUG: Nexalaris {model} failure: {resp.status_code} {resp.text}")
        raise RuntimeError(f"Nexalaris {model} error: {resp.status_code} {resp.text}")

    data = resp.json()
    print(f"DEBUG: Nexalaris {model} response: {data}")
    try:
        content = data["choices"][0]["message"].get("content") or ""
        return content
    except Exception as exc:
        print(f"DEBUG: Unexpected format: {data}")
        raise RuntimeError(f"Unexpected response format from {model}") from exc


def generate_image(prompt: str) -> str:
    """Generate an image using gpt-image-1.5 (DALL-E 3)."""
    model = "gpt-image-1.5"
    _check_rate_limit(model)

    api_key = os.environ.get("NEXALARIS_API_KEY")
    endpoint = os.environ.get("NEXALARIS_OPENAI_ENDPOINT")

    if not api_key or not endpoint:
        raise RuntimeError("Nexalaris API is not configured.")

    url = f"{endpoint.rstrip('/')}/openai/deployments/{model}/images/generations?api-version=2023-12-01-preview"

    headers = {
        "Content-Type": "application/json",
        "api-key": api_key,
    }

    payload = {
        "prompt": prompt,
        "n": 1,
        "size": "1024x1024"
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=60)

    if resp.status_code == 429:
        raise RateLimitError(f"Received 429 from Nexalaris {model} endpoint")

    if not resp.ok:
        raise RuntimeError(f"Nexalaris {model} error: {resp.status_code} {resp.text}")

    data = resp.json()
    try:
        # Some Azure OpenAI image responses wrap the URL in 'data[0].url'
        return data["data"][0]["url"]
    except Exception as exc:
        raise RuntimeError(f"Unexpected response format from {model}") from exc


def transcribe_audio(audio_file_path: str) -> str:
    """Transcribe audio using gpt-4o-transcribe (Whisper-style)."""
    model = "gpt-4o-transcribe"
    api_key = os.environ.get("NEXALARIS_API_KEY")
    endpoint = os.environ.get("NEXALARIS_OPENAI_ENDPOINT")

    if not api_key or not endpoint:
        raise RuntimeError("Nexalaris API is not configured.")

    url = f"{endpoint.rstrip('/')}/openai/deployments/{model}/audio/transcriptions?api-version=2024-02-15-preview"

    headers = {
        "api-key": api_key,
    }

    files = {
        "file": open(audio_file_path, "rb"),
    }
    data = {
        "model": model,
    }

    resp = requests.post(url, headers=headers, files=files, data=data, timeout=60)

    if not resp.ok:
        raise RuntimeError(f"Nexalaris {model} error: {resp.status_code} {resp.text}")

    return resp.json().get("text", "")


def text_to_speech(text: str, voice: str = "en-US-AvaMultilingualNeural") -> bytes:
    """Convert text to speech using Azure TTS endpoint."""
    api_key = os.environ.get("NEXALARIS_API_KEY")
    endpoint = os.environ.get("NEXALARIS_TTS_ENDPOINT")

    if not api_key or not endpoint:
        raise RuntimeError("Nexalaris TTS is not configured.")

    url = f"{endpoint.rstrip('/')}/cognitiveservices/v1"

    headers = {
        "Ocp-Apim-Subscription-Key": api_key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
    }

    # SSML format for Azure TTS
    ssml = f"""<speak version='1.0' xml:lang='en-US'>
        <voice xml:lang='en-US' name='{voice}'>
            {text}
        </voice>
    </speak>"""

    resp = requests.post(url, headers=headers, data=ssml.encode("utf-8"), timeout=30)

    if not resp.ok:
        raise RuntimeError(f"Nexalaris TTS error: {resp.status_code} {resp.text}")

    return resp.content


def speech_to_text(audio_content: bytes, language: str = "en-US") -> str:
    """Convert speech to text using Azure STT."""
    api_key = os.environ.get("NEXALARIS_API_KEY")
    endpoint = os.environ.get("NEXALARIS_STT_ENDPOINT")

    if not api_key or not endpoint:
        raise RuntimeError("Nexalaris STT is not configured.")

    url = f"{endpoint.rstrip('/')}/speech/recognition/conversation/cognitiveservices/v1?language={language}"

    headers = {
        "Ocp-Apim-Subscription-Key": api_key,
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        "Accept": "application/json",
    }

    resp = requests.post(url, headers=headers, data=audio_content, timeout=30)

    if not resp.ok:
        raise RuntimeError(f"Nexalaris STT error: {resp.status_code} {resp.text}")

    data = resp.json()
    return data.get("DisplayText", "")
