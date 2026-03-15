export type Language = "en" | "np";

export const translations = {
  en: {
    // Brand
    brandName: "SmartFinance.ai",

    // Navbar
    aboutUs: "About Us",
    contactUs: "Contact Us",
    terms: "Terms",
    privacy: "Privacy",
    tryAI: "Try AI",

    // Sidebar sections
    aiAssistant: "AI Financial Assistant",
    loanPlanner: "Loan & Investment Planner",
    fraudProtection: "Fraud & Scam Protection",
    financialHealth: "Financial Health & Insights",
    learnFinance: "Learn Finance",

    // Legacy tool labels (for internal tools reuse)
    financialExplainer: "Smart Financial Explainer",
    loanSimulator: "Loan Eligibility Simulator",
    scamDetector: "Scam & Fraud Detector",
    savingsPlanner: "Savings Goal Planner",

    // Chat
    chatPlaceholder: "Ask about loans, savings, interest, or banking...",
    chatTitle: "AI Financial Assistant",
    chatSubtitle: "Your SmartFinance AI-powered financial guide",
    typingIndicator: "SmartFinance AI is thinking...",
    welcomeMessage:
      "Hello! I'm SmartFinance AI, your financial assistant. Ask me anything about loans, savings, interest rates, or financial planning. I'm here to help you make smarter financial decisions.",
    quickSuggestions: "Quick questions:",

    // Savings & scam tool titles
    savingsTitle: "Savings Planner",
    scamTitle: "Text Scam Detector",

    // Loan planner
    loanTitle: "Loan & Investment Planner",
    selectGoal: "Select Your Financial Goal",
    goalBuyHouse: "Buy a House",
    goalEducation: "Education Loan",
    goalBusiness: "Start a Business",
    goalVehicle: "Buy a Vehicle",
    goalSavings: "Save Money",
    goalInvest: "Invest Money",
    monthlyIncome: "Monthly Income (NPR)",
    monthlyExpenses: "Monthly Expenses (NPR)",
    loanAmount: "Loan Amount (NPR)",
    interestRate: "Annual Interest Rate (%)",
    loanDuration: "Loan Duration (Years)",
    calculate: "Calculate",
    estimatedEMI: "Estimated Monthly EMI",
    affordability: "Affordability",
    affordable: "✓ Loan appears affordable",
    highEMI: "⚠ EMI is high relative to income",
    tooHigh: "✗ EMI exceeds disposable income",
    savingsGoal: "Savings Goal (NPR)",
    targetMonths: "Target Months",
    currentSavings: "Current Savings (NPR)",
    monthlySavings: "Required Monthly Savings",
    progressLabel: "Goal Progress",
    planBtn: "Create Plan",
    investAmount: "Investment Amount (NPR)",
    investYears: "Investment Duration (Years)",
    expectedReturn: "Expected Annual Return (%)",
    projectedValue: "Projected Value",
    totalReturns: "Total Returns",

    // Fraud protection
    fraudTitle: "Fraud & Scam Protection",
    analyzeText: "Analyze Text",
    analyzeImage: "Analyze Image",
    scamPlaceholder: 'Paste a suspicious SMS, email, or message here...\n\nExample: "You won Rs. 50,000! Send OTP to claim prize."',
    analyzeBtn: "Analyze Message",
    analyzing: "Analyzing...",
    riskLevel: "Risk Level",
    safe: "SAFE",
    suspicious: "SUSPICIOUS",
    scam: "SCAM",
    scamExplanation: "Analysis",
    uploadImage: "Upload Screenshot",
    uploadHint: "Drag & drop or click to upload SMS, email, or payment screenshot",
    securityTips: "Security Tips",

    // Financial Health
    healthTitle: "Financial Health & Insights",
    smartfinanceScore: "SmartFinance Score",
    savingsDiscipline: "Savings Discipline",
    financialKnowledge: "Financial Knowledge",
    scamAwareness: "Scam Awareness",
    loanReadiness: "Loan Readiness",
    calculateScore: "Calculate My Score",
    savingsPotential: "Savings Potential",
    spendingBreakdown: "Spending Breakdown",
    existingLoans: "Existing Loan EMI (NPR)",

    // Learn Finance
    learnTitle: "Learn Finance",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    bankingBasics: "Banking Basics",
    understandingInterest: "Understanding Interest",
    loansAndEMI: "Loans & EMI",
    digitalPayments: "Digital Payments",
    avoidingScams: "Avoiding Scams",

    monthsLabel: "months",

    // Footer
    footerCopyright: "© 2026 SmartFinance.ai. All rights reserved.",
    termsConditions: "Terms and Conditions",
    privacyPolicy: "Privacy Policy",
  },

  np: {
    // Brand
    brandName: "SmartFinance.ai",

    // Navbar
    aboutUs: "हाम्रो बारे",
    contactUs: "सम्पर्क",
    terms: "नियमहरू",
    privacy: "गोपनीयता",
    tryAI: "AI प्रयोग गर्नुस्",

    // Sidebar sections
    aiAssistant: "AI वित्तीय सहायक",
    loanPlanner: "ऋण र लगानी योजनाकर्ता",
    fraudProtection: "धोखाधडी सुरक्षा",
    financialHealth: "वित्तीय स्वास्थ्य",
    learnFinance: "वित्त सिक्नुस्",

    // Legacy tool labels (for internal tools reuse)
    financialExplainer: "स्मार्ट वित्तीय व्याख्याकार",
    loanSimulator: "ऋण पात्रता गणक",
    scamDetector: "घोटाला जाँच उपकरण",
    savingsPlanner: "बचत लक्ष्य योजनाकर्ता",

    // Chat
    chatPlaceholder: "ऋण, बचत, ब्याज वा बैंकिङबारे सोध्नुस्...",
    chatTitle: "AI वित्तीय सहायक",
    chatSubtitle: "तपाईंको SmartFinance AI वित्तीय मार्गदर्शक",
    typingIndicator: "SmartFinance AI सोच्दैछ...",
    welcomeMessage:
      "नमस्ते! म SmartFinance AI, तपाईंको वित्तीय सहायक हुँ। ऋण, बचत, ब्याज दर वा वित्तीय योजनाबारे कुनै पनि प्रश्न सोध्नुस्।",
    quickSuggestions: "द्रुत प्रश्नहरू:",

    // Savings & scam tool titles
    savingsTitle: "बचत योजनाकर्ता",
    scamTitle: "पाठ घोटाला जाँचकर्ता",

    // Loan planner
    loanTitle: "ऋण र लगानी योजनाकर्ता",
    selectGoal: "आफ्नो वित्तीय लक्ष्य छान्नुस्",
    goalBuyHouse: "घर किन्ने",
    goalEducation: "शिक्षा ऋण",
    goalBusiness: "व्यापार सुरु गर्ने",
    goalVehicle: "सवारी साधन किन्ने",
    goalSavings: "बचत गर्ने",
    goalInvest: "लगानी गर्ने",
    monthlyIncome: "मासिक आम्दानी (रु.)",
    monthlyExpenses: "मासिक खर्च (रु.)",
    loanAmount: "ऋण रकम (रु.)",
    interestRate: "वार्षिक ब्याज दर (%)",
    loanDuration: "ऋण अवधि (वर्ष)",
    calculate: "गणना गर्नुस्",
    estimatedEMI: "अनुमानित मासिक EMI",
    affordability: "सामर्थ्य स्थिति",
    affordable: "✓ ऋण वहनयोग्य",
    highEMI: "⚠ EMI बढी छ",
    tooHigh: "✗ EMI धेरै बढी छ",
    savingsGoal: "बचत लक्ष्य (रु.)",
    targetMonths: "लक्ष्य महिना",
    currentSavings: "हालको बचत (रु.)",
    monthlySavings: "आवश्यक मासिक बचत",
    progressLabel: "लक्ष्य प्रगति",
    planBtn: "योजना बनाउनुस्",
    investAmount: "लगानी रकम (रु.)",
    investYears: "लगानी अवधि (वर्ष)",
    expectedReturn: "अपेक्षित वार्षिक प्रतिफल (%)",
    projectedValue: "अनुमानित मूल्य",
    totalReturns: "कुल प्रतिफल",

    // Fraud protection
    fraudTitle: "धोखाधडी र घोटाला सुरक्षा",
    analyzeText: "पाठ विश्लेषण",
    analyzeImage: "छवि विश्लेषण",
    scamPlaceholder: "शंकास्पद SMS, इमेल, वा सन्देश यहाँ टाँस्नुस्...",
    analyzeBtn: "सन्देश विश्लेषण गर्नुस्",
    analyzing: "विश्लेषण गर्दैछ...",
    riskLevel: "जोखिम स्तर",
    safe: "सुरक्षित",
    suspicious: "शंकास्पद",
    scam: "धोखाधडी",
    scamExplanation: "विश्लेषण",
    uploadImage: "स्क्रिनसट अपलोड गर्नुस्",
    uploadHint: "SMS, इमेल, वा भुक्तानी स्क्रिनसट अपलोड गर्नुस्",
    securityTips: "सुरक्षा सुझावहरू",

    // Financial Health
    healthTitle: "वित्तीय स्वास्थ्य र अन्तर्दृष्टि",
    smartfinanceScore: "SmartFinance स्कोर",
    savingsDiscipline: "बचत अनुशासन",
    financialKnowledge: "वित्तीय ज्ञान",
    scamAwareness: "घोटाला जागरूकता",
    loanReadiness: "ऋण तयारी",
    calculateScore: "मेरो स्कोर गणना गर्नुस्",
    savingsPotential: "बचत सम्भावना",
    spendingBreakdown: "खर्च विवरण",
    existingLoans: "हालको ऋण EMI (रु.)",

    // Learn Finance
    learnTitle: "वित्त सिक्नुस्",
    beginner: "आधारभूत",
    intermediate: "मध्यवर्ती",
    advanced: "उन्नत",
    bankingBasics: "बैंकिङ आधारहरू",
    understandingInterest: "ब्याज बुझ्ने",
    loansAndEMI: "ऋण र EMI",
    digitalPayments: "डिजिटल भुक्तानी",
    avoidingScams: "घोटालाबाट बच्ने",

    monthsLabel: "महिना",

    // Footer
    footerCopyright: "© 2026 SmartFinance.ai. सर्वाधिकार सुरक्षित।",
    termsConditions: "नियम र सर्तहरू",
    privacyPolicy: "गोपनीयता नीति",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
