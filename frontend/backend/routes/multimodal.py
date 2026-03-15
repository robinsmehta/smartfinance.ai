from flask import Blueprint, jsonify, request, send_file
import io
import os
from services.llm_client import (
    generate_image, 
    speech_to_text, 
    text_to_speech, 
    transcribe_audio,
    RateLimitError
)

multimodal_bp = Blueprint("multimodal", __name__, url_prefix="/api")

@multimodal_bp.post("/generate-image")
def handle_image():
    data = request.get_json(silent=True) or {}
    prompt = (data.get("prompt") or "").strip()

    if not prompt:
        return jsonify({"error": "prompt is required"}), 400

    try:
        image_url = generate_image(prompt)
        return jsonify({"image_url": image_url})
    except RateLimitError as rl_err:
        return jsonify({"error": str(rl_err)}), 429
    except Exception as exc:
        return jsonify({"error": f"Failed to generate image: {str(exc)}"}), 500

@multimodal_bp.post("/tts")
def handle_tts():
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()

    if not text:
        return jsonify({"error": "text is required"}), 400

    try:
        audio_content = text_to_speech(text)
        return send_file(
            io.BytesIO(audio_content),
            mimetype="audio/mpeg",
            as_attachment=False,
            download_name="speech.mp3"
        )
    except Exception as exc:
        return jsonify({"error": f"Failed to generate speech: {str(exc)}"}), 500

@multimodal_bp.post("/stt")
def handle_stt():
    if "file" not in request.files:
        return jsonify({"error": "audio file is required"}), 400
    
    audio_file = request.files["file"]
    
    # Save temporarily to process
    temp_path = "temp_audio.wav"
    audio_file.save(temp_path)
    
    try:
        # Try Whisper-style transcription first
        text = transcribe_audio(temp_path)
        return jsonify({"text": text})
    except Exception as exc:
        try:
            # Fallback to standard Azure STT
            with open(temp_path, "rb") as f:
                content = f.read()
            text = speech_to_text(content)
            return jsonify({"text": text})
        except Exception as fallback_exc:
            return jsonify({"error": f"Failed to transcribe: {str(fallback_exc)}"}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
