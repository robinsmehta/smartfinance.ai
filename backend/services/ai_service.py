import os
from typing import Dict, Any
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(
    api_key="By75sYyrPgd7pqOjMaXPmQGHoGyUqdGEegzF3QSIaImpr6T1zF6JJQQJ99CCACfhMk5XJ3w3AAAAACOGzx69"
)

# Model configurations
MODELS = {
    "chat": "gpt-5.4",
    "audio": "gpt-audio-1.5",
    "transcribe": "gpt-4o-transcribe",
    "tts": "tts",
    "image": "gpt-image-1.5",
    "realtime": "gpt-realtime-1.5"
}

# System prompt for financial AI assistant
SYSTEM_PROMPT = """You are SmartFinance.ai, an advanced AI financial assistant designed to help users with financial education, planning, and decision-making.

IMPORTANT GUIDELINES:
1. **Educational Focus**: Provide clear, accurate financial education and explanations
2. **Transparency**: Always disclose that you are AI and not a licensed financial advisor
3. **Conservative Advice**: Never give personalized investment or loan advice
4. **Risk Awareness**: Emphasize that all financial decisions carry risks
5. **Verification**: For calculations, recommend users verify with official tools
6. **Ethical Standards**: Promote responsible financial behavior and scam awareness

CAPABILITIES:
- Explain financial concepts (loans, savings, investments, compound interest)
- Help with basic financial planning and goal setting
- Provide educational content about scam protection
- Assist with understanding financial products
- Guide users toward professional financial advice when needed

RESPONSE STYLE:
- Be helpful, clear, and encouraging
- Use simple language, avoid jargon or explain it
- Keep responses focused and actionable
- Include relevant disclaimers
- End with questions to continue the conversation

DISCLAIMER: I am an AI assistant, not a licensed financial advisor. All information is for educational purposes only. Consult professionals for personalized advice."""

def validate_financial_query(message: str) -> Dict[str, Any]:
    """Validate and categorize the financial query"""
    message_lower = message.lower()

    validation = {
        "is_valid": True,
        "category": "general",
        "risk_level": "low",
        "needs_disclaimer": True,
        "flags": []
    }

    # Categorize the query
    if any(word in message_lower for word in ["loan", "emi", "mortgage", "credit"]):
        validation["category"] = "loans"
    elif any(word in message_lower for word in ["save", "savings", "budget", "emergency"]):
        validation["category"] = "savings"
    elif any(word in message_lower for word in ["invest", "stock", "mutual fund", "portfolio"]):
        validation["category"] = "investments"
        validation["risk_level"] = "high"
    elif any(word in message_lower for word in ["scam", "fraud", "phishing", "otp"]):
        validation["category"] = "security"
    elif any(word in message_lower for word in ["tax", "deduction", "return"]):
        validation["category"] = "taxes"
        validation["risk_level"] = "medium"

    # Flag high-risk topics
    if validation["risk_level"] == "high":
        validation["flags"].append("investment_advice")
    if "personal" in message_lower or "my situation" in message_lower:
        validation["flags"].append("personalized_advice")

    return validation

def build_response(message: str) -> str:
    """Build AI-powered response with guardrails"""

    # Validate the query
    validation = validate_financial_query(message)

    # Prepare enhanced prompt with context
    enhanced_prompt = f"""
User Query: {message}

Query Analysis:
- Category: {validation['category']}
- Risk Level: {validation['risk_level']}
- Flags: {', '.join(validation['flags']) if validation['flags'] else 'None'}

Please provide a helpful, educational response following the guidelines above.
"""

    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model=MODELS["chat"],
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": enhanced_prompt}
            ],
            max_tokens=1000,
            temperature=0.7,
            presence_penalty=0.1,
            frequency_penalty=0.1
        )

        ai_response = response.choices[0].message.content.strip()

        # Add mandatory disclaimer for high-risk topics
        if validation["risk_level"] in ["high", "medium"] or validation["flags"]:
            disclaimer = "\n\n⚠️ **Important Disclaimer:** This is educational information only. I am an AI assistant, not a licensed financial advisor. For personalized advice, consult qualified professionals."
            ai_response += disclaimer

        return ai_response

    except Exception as e:
        # Log the error for debugging
        print(f"AI Service Error: {str(e)}")
        # Fallback to enhanced basic responses
        return get_enhanced_fallback_response(message, validation)

def get_enhanced_fallback_response(message: str, validation: Dict[str, Any]) -> str:
    """Enhanced fallback responses with better educational content"""
    text = (message or "").lower()

    # Enhanced responses based on category
    if validation["category"] == "loans":
        if "emi" in text or "equated monthly" in text:
            response = (
                "💰 **EMI (Equated Monthly Installment)** is a fixed payment you make every month that covers both principal and interest.\n\n"
                "**Key Points:**\n"
                "• EMIs are calculated using the loan amount, interest rate, and tenure\n"
                "• Higher interest rates or longer tenures increase EMI amounts\n"
                "• As a rule of thumb, keep total EMIs under 40% of your monthly income\n"
                "• Prepay when possible to reduce interest burden\n\n"
                "**Formula:** EMI = [P x R x (1+R)^N] / [(1+R)^N-1]\n"
                "Where: P=Principal, R=Monthly interest rate, N=Number of months"
            )
        elif any(k in text for k in ["home loan", "house loan", "mortgage"]):
            response = (
                "🏠 **Home Loans** help you buy property and repay over many years.\n\n"
                "**What banks consider:**\n"
                "• Your income and existing EMIs\n"
                "• Credit score and history\n"
                "• Property value and location\n"
                "• Your age and employment stability\n\n"
                "**Tips:**\n"
                "• Compare interest rates from multiple banks\n"
                "• Consider prepayment options\n"
                "• Factor in additional costs (stamp duty, registration)\n"
                "• Aim for loan tenure that keeps EMI comfortable"
            )
        else:
            response = (
                "💳 **Understanding Loans:**\n\n"
                "Loans are borrowed money that you repay with interest over time.\n\n"
                "**Types of loans:**\n"
                "• **Personal Loans:** For various needs, higher interest rates\n"
                "• **Home Loans:** For property purchase, lower interest rates\n"
                "• **Education Loans:** For studies, often subsidized\n"
                "• **Business Loans:** For entrepreneurs\n\n"
                "**Important considerations:**\n"
                "• Compare interest rates and terms\n"
                "• Check eligibility and documentation\n"
                "• Understand all fees and charges\n"
                "• Plan repayment capacity carefully"
            )

    elif validation["category"] == "savings":
        if any(k in text for k in ["emergency fund"]):
            response = (
                "🛡️ **Emergency Fund** is your financial safety net!\n\n"
                "**Why it's crucial:**\n"
                "• Covers unexpected expenses (medical, car repair, job loss)\n"
                "• Prevents taking high-interest debt in emergencies\n"
                "• Gives peace of mind\n\n"
                "**How much to save:**\n"
                "• **Minimum:** 3 months of essential expenses\n"
                "• **Ideal:** 6 months of living expenses\n"
                "• **For high-risk jobs:** 9-12 months\n\n"
                "**Where to keep it:**\n"
                "• High-interest savings account\n"
                "• Liquid funds or short-term FDs\n"
                "• Easy to access but earning some interest"
            )
        else:
            response = (
                "💸 **Smart Saving Strategies:**\n\n"
                "**The 50/30/20 Rule:**\n"
                "• 50% of income: Needs (rent, food, utilities)\n"
                "• 30% of income: Wants (entertainment, dining out)\n"
                "• 20% of income: Savings and debt repayment\n\n"
                "**Tips to save more:**\n"
                "• Automate transfers to savings account\n"
                "• Track expenses daily\n"
                "• Cut unnecessary subscriptions\n"
                "• Cook at home more often\n"
                "• Use cashback and rewards programs wisely"
            )

    elif validation["category"] == "investments":
        response = (
            "📈 **Investment Basics** (Educational Information Only)\n\n"
            "**Key Concepts:**\n"
            "• **Risk vs Return:** Higher potential returns usually mean higher risk\n"
            "• **Diversification:** Don't put all eggs in one basket\n"
            "• **Long-term thinking:** Markets fluctuate, but tend to grow over time\n"
            "• **Inflation:** Your money loses value if it doesn't grow\n\n"
            "**Common Investment Options:**\n"
            "• **Stocks:** Ownership in companies, high risk/high return\n"
            "• **Mutual Funds:** Professional management, diversified\n"
            "• **Fixed Deposits:** Safe but low returns\n"
            "• **PPF/Pension Schemes:** Tax benefits, long-term\n\n"
            "**⚠️ Important:** This is not personalized advice. Consult a SEBI-registered advisor."
        )

    elif validation["category"] == "security":
        response = (
            "🔒 **Digital Safety & Scam Protection**\n\n"
            "**Common Scams to Avoid:**\n"
            "• **OTP Scams:** Never share OTP, PIN, or card details\n"
            "• **Prize/Lottery Scams:** Real banks don't ask for fees to release prizes\n"
            "• **Investment Scams:** Promises of guaranteed high returns\n"
            "• **Tech Support Scams:** Unsolicited calls about computer problems\n\n"
            "**Safety Tips:**\n"
            "• Verify caller/sender identity independently\n"
            "• Never click suspicious links or download unknown files\n"
            "• Use official apps and websites only\n"
            "• Enable two-factor authentication\n"
            "• Report suspicious activity to bank immediately"
        )

    else:
        # General financial education
        response = (
            "🎓 **Financial Literacy Hub**\n\n"
            "I'm here to help you understand:\n\n"
            "💰 **Loans & EMIs**\n"
            "• How EMIs are calculated\n"
            "• Different types of loans\n"
            "• Factors affecting loan approval\n\n"
            "💸 **Saving & Budgeting**\n"
            "• Building emergency funds\n"
            "• Smart saving strategies\n"
            "• Budget planning tips\n\n"
            "📈 **Investments** (Education Only)\n"
            "• Basic investment concepts\n"
            "• Risk and return relationship\n"
            "• Diversification importance\n\n"
            "🔒 **Digital Safety**\n"
            "• Scam recognition\n"
            "• Safe online practices\n"
            "• Banking security tips\n\n"
            "What topic interests you most? 🤔"
        )

    # Add disclaimer for high-risk topics
    if validation["risk_level"] in ["high", "medium"] or validation["flags"]:
        response += "\n\n⚠️ **Disclaimer:** This is educational information only. I am an AI assistant, not a licensed financial advisor. For personalized financial advice, consult qualified professionals."

    return response

def generate_financial_explanation(topic: str) -> str:
    """Generate detailed explanation for a financial topic"""
    try:
        response = client.chat.completions.create(
            model=MODELS["chat"],
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Provide a detailed, educational explanation of: {topic}. Keep it clear and helpful for beginners."}
            ],
            max_tokens=800,
            temperature=0.3
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Explanation generation error: {e}")
        return f"Sorry, I couldn't generate an explanation for {topic} right now. Please try again later."

def validate_calculation(calculation_type: str, inputs: Dict[str, Any], result: float) -> bool:
    """Validate AI-generated calculations against deterministic logic"""
    # This would contain validation logic for different calculation types
    # For now, return True (implement specific validations as needed)
    return True
