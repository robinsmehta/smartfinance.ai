from flask import Blueprint, jsonify, request

from services.llm_client import chat_completion, RateLimitError


chat_bp = Blueprint("chat", __name__, url_prefix="/api")


@chat_bp.post("/chat")
def handle_chat():
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()
    model = (data.get("model") or "gpt-4").strip()
    language = (data.get("language") or "en").strip().lower()

    if not message:
        return jsonify({"error": "message is required"}), 400

    lang_instruction = "Respond in English."
    if language == "np":
        lang_instruction = "Respond in Nepali (नेपाली भाषामा जवाफ दिनुहोस्)."

    try:
        sys_prompt = f"""You are SmartFinance AI, a helpful financial assistant. {lang_instruction}
Analyze the user's financial data and provide clear, structured advice.
Use Markdown for headings and lists. Be concise and friendly.
IMAGE GENERATION: You can use [IMAGE_PROMPT: <description>] to include helpful visuals."""
        
        reply = chat_completion([
            {"role": "system", "content": sys_prompt},
            {"role": "user", "content": message},
        ], model=model)

        # Intercept image generation prompts
        import re
        from services.llm_client import generate_image
        
        def image_replacer(match):
            prompt = match.group(1).strip()
            try:
                img_url = generate_image(prompt)
                return f"\n\n![Generated Image]({img_url})\n\n"
            except Exception as e:
                print(f"Failed to generate image: {e}")
                return "\n\n*(Failed to generate image)*\n\n"
        
        reply = re.sub(r"\[IMAGE_PROMPT:(.*?)\]", image_replacer, reply, flags=re.IGNORECASE | re.DOTALL)

        return jsonify({"reply": reply})
    except RateLimitError as rl_err:
        return jsonify({"error": str(rl_err)}), 429
    except Exception as exc:  # pragma: no cover - defensive
        # Do not leak internal details to the client
        return jsonify({"error": "SmartFinance AI is temporarily unavailable. Please try again in a moment."}), 500
