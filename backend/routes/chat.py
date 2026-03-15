from flask import Blueprint, jsonify, request

from services.llm_client import chat_completion, RateLimitError


chat_bp = Blueprint("chat", __name__, url_prefix="/api")


@chat_bp.post("/chat")
def handle_chat():
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()

    if not message:
        return jsonify({"error": "message is required"}), 400

    try:
        reply = chat_completion([
            {"role": "system", "content": "You are SmartFinance AI, a helpful Nepali-friendly financial assistant."},
            {"role": "user", "content": message},
        ])
        return jsonify({"reply": reply})
    except RateLimitError as rl_err:
        return jsonify({"error": str(rl_err)}), 429
    except Exception as exc:  # pragma: no cover - defensive
        # Do not leak internal details to the client
        return jsonify({"error": "SmartFinance AI is temporarily unavailable. Please try again in a moment."}), 500
