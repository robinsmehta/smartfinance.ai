import re
import json
import base64

from flask import Blueprint, jsonify, request
from services.llm_client import chat_completion, RateLimitError


scam_bp = Blueprint("scam", __name__, url_prefix="/api")

# ---------------------------------------------------------------------------
# Keyword pre-scan helpers
# ---------------------------------------------------------------------------

_SCAM_KEYWORDS = [
    "otp", "bank", "account", "password", "urgent", "verify",
    "lottery", "prize", "payment", "transfer", "link", "click",
    "update account", "pin", "kyc", "credential", "suspended",
    "blocked", "deactivated", "winner", "congratulations", "tax",
    "refund", "bitcoin", "crypto",
]

_FINANCIAL_KEYWORDS = [
    "bank", "loan", "emi", "account", "payment", "transfer", "interest",
    "savings", "invest", "credit", "debit", "wallet", "kyc", "upi",
    "neft", "rtgs", "imps", "insurance", "mutual fund", "tax",
    "income", "salary", "receipt", "invoice", "bill",
]


def _keyword_pre_scan(text: str) -> dict:
    """Return detected scam and financial keywords from text."""
    lower = re.sub(r"\s+", " ", text.lower())
    words = lower.split()
    scam_hits = [kw for kw in _SCAM_KEYWORDS if kw in lower]
    financial_hits = [kw for kw in _FINANCIAL_KEYWORDS if kw in lower]
    return {"scam_hits": scam_hits, "financial_hits": financial_hits}


def _build_text_prompt(text: str, scam_hits: list, financial_hits: list) -> str:
    hint = ""
    if scam_hits:
        hint = f"\nKeyword pre-scan detected these suspicious terms: {', '.join(scam_hits)}."
    elif not financial_hits:
        hint = "\nKeyword pre-scan found NO financial terms in this text."

    return f"""You are a financial scam detection AI. Analyze the following message and classify it strictly into one of:
- Scam
- Suspicious
- Safe
- Not Financial Content

Rules:
- If the text explicitly asks for OTP, PIN, password, or bank details → Scam
- If it contains unknown payment links or urgent action requests related to finance → Suspicious
- If it is normal banking, financial advice or transaction notification → Safe
- If it is completely unrelated to finance, money, or banking → Not Financial Content
{hint}

Respond ONLY with a valid JSON object, no markdown, no explanation outside JSON. Format:
{{
  "risk_level": "Scam | Suspicious | Safe | Not Financial Content",
  "summary": "<1 short sentence>",
  "warning_signs": ["list", "of", "signals"],
  "confidence": "High | Medium | Low"
}}

Message to analyze:
\"\"\"{text}\"\"\"
"""


def _build_image_system_prompt() -> str:
    return """You are a financial scam detection AI. Analyze the visual content of the provided image and classify it as one of:
- Scam
- Suspicious
- Safe
- Unknown Image
- Not Financial Content

Rules:
- If the image contains text asking for OTP, PIN, password, or bank account details → Scam
- If it contains suspicious payment links or urgent financial requests → Suspicious
- If it is a legitimate bank statement, receipt, or financial notice → Safe
- If no meaningful financial content is detected → Not Financial Content
- If the image is too garbled, empty, or unclear to determine → Unknown Image

Respond ONLY with a valid JSON object, no markdown. Format:
{
  "risk_level": "Scam | Suspicious | Safe | Unknown Image | Not Financial Content",
  "summary": "<1 short sentence summarizing what the image shows>",
  "warning_signs": ["list", "of", "signals"],
  "confidence": "High | Medium | Low"
}
"""


def _call_gpt_for_scam(messages: list) -> dict:
    """Call GPT-4 and parse the JSON response."""
    raw = chat_completion(
        messages,
        model="gpt-5.4"
    )
    raw = raw.strip()
    # Strip markdown fences if present
    if raw.startswith("```"):
        raw = re.sub(r"^```[a-z]*\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)
    return json.loads(raw)


# ---------------------------------------------------------------------------
# TEXT endpoint
# ---------------------------------------------------------------------------

@scam_bp.post("/scam-detector-text")
def scam_detector_text():
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    model = (data.get("model") or "gpt-5.4").strip()

    if not text:
        return jsonify({"error": "text is required"}), 400

    try:
        scan = _keyword_pre_scan(text)
        prompt = _build_text_prompt(text, scan["scam_hits"], scan["financial_hits"])
        result = _call_gpt_for_scam([{"role": "user", "content": prompt}])
        return jsonify(result)
    except RateLimitError as e:
        return jsonify({"error": str(e)}), 429
    except Exception as e:
        print(f"scam-detector-text error: {e}")
        return jsonify({"error": "Analysis failed. Please try again."}), 500


# ---------------------------------------------------------------------------
# IMAGE endpoint
# ---------------------------------------------------------------------------

@scam_bp.post("/scam-detector-image")
def scam_detector_image():
    data = request.get_json(silent=True) or {}
    image_b64 = (data.get("image_base64") or "").strip()

    if not image_b64:
        return jsonify({"error": "image_base64 is required"}), 400

    try:
        messages = [
            {"role": "system", "content": _build_image_system_prompt()},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Analyze this screenshot for financial scams based on your instructions."},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_b64}"
                        }
                    }
                ]
            }
        ]
        
        result = _call_gpt_for_scam(messages)
        return jsonify(result)
    except RateLimitError as e:
        return jsonify({"error": str(e)}), 429
    except Exception as e:
        print(f"scam-detector-image error: {e}")
        return jsonify({"error": "Image analysis failed. Please try again."}), 500


# ---------------------------------------------------------------------------
# Legacy /scam-check endpoint (keep for backwards compatibility)
# ---------------------------------------------------------------------------

@scam_bp.post("/scam-check")
def analyze_scam():
    data = request.get_json(silent=True) or {}
    message = data.get("message")
    if not isinstance(message, str) or not message.strip():
        return jsonify({"error": "message is required"}), 400
    # Forward to the new logic and adapt the response shape
    try:
        scan = _keyword_pre_scan(message)
        prompt = _build_text_prompt(message, scan["scam_hits"], scan["financial_hits"])
        result = _call_gpt_for_scam([{"role": "user", "content": prompt}])
        # Map new field names to old ones for legacy consumers
        level_map = {"Scam": "scam", "Suspicious": "suspicious", "Safe": "safe", "Not Financial Content": "safe"}
        return jsonify({
            "level": level_map.get(result.get("risk_level", ""), "safe"),
            "explanation": result.get("summary", ""),
            "signals": result.get("warning_signs", []),
        })
    except RateLimitError as e:
        return jsonify({"error": str(e)}), 429
    except Exception as e:
        return jsonify({"error": "Analysis failed."}), 500
