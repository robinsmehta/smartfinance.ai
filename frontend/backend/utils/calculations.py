def calculate_emi(principal: float, annual_rate: float, years: float) -> float:
    """Calculate EMI using standard formula.

    principal: loan amount
    annual_rate: annual interest rate in percent
    years: duration in years
    """
    months = int(years * 12)
    if months <= 0:
        return 0.0

    monthly_rate = annual_rate / 100.0 / 12.0
    if monthly_rate == 0:
        return principal / months

    factor = (1 + monthly_rate) ** months
    return principal * monthly_rate * factor / (factor - 1)
