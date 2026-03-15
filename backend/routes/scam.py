import re

from flask import Blueprint, jsonify, request


scam_bp = Blueprint("scam", __name__, url_prefix="/api")


_SCAM_PATTERNS = [
    (re.compile(r"otp|pin|password|passcode", re.IGNORECASE), 4, "Requests sensitive authentication data (OTP/PIN)"),
    (re.compile(r"won|winner|prize|lucky|congratulations", re.IGNORECASE), 3, "Prize or lottery style bait"),
    (re.compile(r"urgent|immediately|act now|expires|24 hour", re.IGNORECASE), 2, "Creates artificial urgency"),
    (re.compile(r"send|transfer|deposit|pay.*fee|advance.*fee", re.IGNORECASE), 3, "Requests money upfront"),
    (re.compile(r"click here|link|http|bit\\.ly|tinyurl", re.IGNORECASE), 2, "Suspicious link or redirect"),
    (re.compile(r"income tax|irs|govt|government|police|arrest", re.IGNORECASE), 3, "Impersonates authority"),
    (re.compile(r"free|no cost|zero fee|100%", re.IGNORECASE), 1, "Unrealistic free offer"),
    (re.compile(r"verify.*account|suspended|blocked|deactivated", re.IGNORECASE), 3, "Account threat / phishing"),
    (re.compile(r"bitcoin|crypto|invest.*profit|double.*money", re.IGNORECASE), 3, "Suspicious investment scheme"),
]


def _run_scam_analysis(text: str):
    total_weight = 0
    signals: list[str] = []

    for pattern, weight, signal in _SCAM_PATTERNS:
        if pattern.search(text):
            total_weight += weight
            signals.append(signal)

    level = "safe"
    explanation = (
        "No major scam indicators found. Still, do not share OTPs, PINs, or full card "
        "details, and always verify sender identity."
    )

    if total_weight >= 6:
        level = "scam"
        explanation = (
            "This message matches multiple strong scam patterns. Do not reply, click "
            "links, or share OTPs. Contact your bank using an official number if unsure."
        )
    elif total_weight >= 3:
        level = "suspicious"
        explanation = (
            "There are warning signs of a potential scam. Be careful, verify details "
            "through official channels, and never share OTPs or passwords."
        )

    return {"level": level, "explanation": explanation, "signals": signals}


@scam_bp.post("/scam-check")
def analyze_scam():
    data = request.get_json(silent=True) or {}
    message = data.get("message")

    if not isinstance(message, str) or not message.strip():
        return jsonify({"error": "message is required"}), 400

    result = _run_scam_analysis(message)
    return jsonify(result)
