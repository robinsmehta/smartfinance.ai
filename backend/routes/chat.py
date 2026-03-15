from flask import Blueprint, jsonify, request

from services.ai_service import build_response


chat_bp = Blueprint("chat", __name__, url_prefix="/api")


@chat_bp.post("/chat")
def handle_chat():
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()

    if not message:
        return jsonify({"error": "message is required"}), 400

    reply = build_response(message)
    return jsonify({"reply": reply})
