from flask import Blueprint, jsonify, request

from utils.calculations import calculate_emi


loan_bp = Blueprint("loan", __name__, url_prefix="/api")


@loan_bp.post("/loan-simulator")
def simulate_loan():
    data = request.get_json(silent=True) or {}

    try:
        inc = float(data.get("income", 0))
        exp = float(data.get("expenses", 0))
        amt = float(data.get("loanAmount", 0))
        rate = float(data.get("interestRate", 0))
        yrs = float(data.get("durationYears", 0))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid loan simulation payload"}), 400

    if any(v <= 0 for v in [inc, exp, amt, rate, yrs]):
        return jsonify({"error": "Invalid loan simulation payload"}), 400

    emi = calculate_emi(amt, rate, yrs)
    disposable = inc - exp

    status = "tooHigh"
    suggestion = (
        "EMI is higher than your disposable income. Consider a smaller loan, lower "
        "interest, or longer tenure."
    )

    if emi <= disposable * 0.4:
        status = "affordable"
        suggestion = (
            "Loan looks affordable relative to your income. Keep total EMIs under ~40% "
            "of income."
        )
    elif emi <= disposable * 0.6:
        status = "high"
        suggestion = (
            "EMI is on the higher side. Re-check if this fits your monthly budget."
        )

    return jsonify(
        {"emi": emi, "status": status, "disposable": disposable, "suggestion": suggestion}
    )
