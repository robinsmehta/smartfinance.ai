def build_response(message: str) -> str:
    text = (message or "").lower()

    if "emi" in text or "equated monthly" in text:
        return (
            "EMI (Equated Monthly Installment) is a fixed payment paid every month, "
            "covering both principal and interest. As a rule of thumb, try to keep "
            "total EMIs under 40% of your monthly income."
        )

    if any(k in text for k in ["home loan", "house loan", "mortgage"]):
        return (
            "Home loans let you buy property and repay over many years. Banks look at "
            "your income, existing EMIs, and credit history. Keeping EMI under 40% of "
            "your income is generally considered comfortable."
        )

    if any(k in text for k in ["scam", "fraud", "otp", "prize", "lottery"]):
        return (
            "Be careful: real banks or wallets will never ask for your OTP, PIN, or "
            "full card details on calls, SMS, or social media. If a message feels "
            "rushed, offers big prizes, or asks for OTP, treat it as a scam."
        )

    if any(k in text for k in ["save", "savings", "emergency fund"]):
        return (
            "Start by building a 3–6 month emergency fund. Automate a fixed saving "
            "amount every month into a separate account so you are not tempted to "
            "spend it."
        )

    if any(k in text for k in ["compound interest", "compounding"]):
        return (
            "Compound interest means you earn interest on your principal plus previous "
            "interest. Over long periods, this can significantly grow savings and "
            "investments compared to simple interest."
        )

    return (
        "That is a good financial question. Think about your income, expenses, and "
        "goals before taking loans or investing. I can help you understand loans, "
        "savings, interest, digital payments, or scam safety — try asking about one "
        "of these."
    )
