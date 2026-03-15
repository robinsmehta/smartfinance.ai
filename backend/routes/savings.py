from flask import Blueprint, jsonify, request


savings_bp = Blueprint("savings", __name__, url_prefix="/api")


@savings_bp.post("/savings-plan")
def plan_savings():
    data = request.get_json(silent=True) or {}

    try:
        goal = float(data.get("goalAmount", 0))
        months = float(data.get("targetMonths", 0))
        current = float(data.get("currentSavings", 0) or 0)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid savings plan payload"}), 400

    if goal <= 0 or months <= 0:
        return jsonify({"error": "Invalid savings plan payload"}), 400

    remaining = max(goal - current, 0)
    monthly_saving = remaining / months
    progress = min((current / goal) * 100 if goal else 0, 100)

    return jsonify(
        {
            "monthlySaving": monthly_saving,
            "monthsLeft": months,
            "progress": progress,
            "totalNeeded": remaining,
        }
    )
