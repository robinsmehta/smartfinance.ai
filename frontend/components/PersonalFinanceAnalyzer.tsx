"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart as LineChartIcon, PieChart, Home, Car, GraduationCap, Briefcase, Calculator, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from "recharts";
import { useLanguage } from "@/lib/LanguageContext";

// --- Types & Constants ---
type SuggestionType = "home" | "education" | "asset" | "investment" | null;

const SUGGESTIONS = [
  { id: "home", title: "Home Loan", icon: Home, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", desc: "Finance a house using your savings as a down payment." },
  { id: "asset", title: "Asset Purchase", icon: Car, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", desc: "Calculate loans for a vehicle or equipment." },
  { id: "education", title: "Education Loan", icon: GraduationCap, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", desc: "Plan funding for higher education." },
  { id: "investment", title: "Investment Plan", icon: Briefcase, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30", desc: "Grow wealth via disciplined monthly investing." },
];

function formatCurrency(val: number) {
  return "NPR " + val.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function PersonalFinanceAnalyzer() {
  const { t } = useLanguage();

  // Step 1: User Input Form
  const [incomeStr, setIncomeStr] = useState("");
  const [expenseStr, setExpenseStr] = useState("");
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  // Computed Base Financials
  const income = parseFloat(incomeStr) || 0;
  const expenses = parseFloat(expenseStr) || 0;
  const savings = Math.max(0, income - expenses);
  
  // Removed old manual Loan UI states here

  // --- Handlers ---
  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (income > 0) setIsAnalyzed(true);
  };

  const resetAnalysis = () => {
    setIsAnalyzed(false);
  };

  const handleCardClick = (_id: string, title: string) => {
    const contextPrompt = `{im planning for a ${title}. Here is my current financial details: Monthly Income ${formatCurrency(income)}, Monthly Expenses ${formatCurrency(expenses)}, Monthly Savings ${formatCurrency(savings)}, 12-Month Projected Savings ${formatCurrency(savings * 12)}. Could you please guide?}`;

    setGeneratedPrompt(contextPrompt);
    setCopied(false);
  };

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  // Graph Data
  const graphData = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    savings: savings * (i + 1),
    income: income * (i + 1),
    expenses: expenses * (i + 1)
  }));

  const inputClasses = "w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20";
  const labelClasses = "text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider";

  return (
    <div className="h-full overflow-y-auto px-4 md:px-6 py-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
            <PieChart className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Personal Finance Analyzer</h2>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">Visualize your cash flow and get smart loan suggestions.</p>
          </div>
        </div>

        {/* Step 1: Input Form */}
        {!isAnalyzed ? (
          <motion.form 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAnalyze} 
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Monthly Income</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium font-mono text-sm">NPR</span>
                  <input
                    type="number" min={0} required
                    value={incomeStr} onChange={(e) => setIncomeStr(e.target.value)}
                    className={`${inputClasses} pl-14 font-mono text-lg`} placeholder="e.g. 50000"
                  />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Monthly Expenses</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium font-mono text-sm">NPR</span>
                  <input
                    type="number" min={0} required
                    value={expenseStr} onChange={(e) => setExpenseStr(e.target.value)}
                    className={`${inputClasses} pl-14 font-mono text-lg`} placeholder="e.g. 20000"
                  />
                </div>
              </div>
            </div>
            
            <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              Analyze My Finances
            </button>
          </motion.form>
        ) : (
          /* Step 2-4: Dashboard & Charts */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Financial Snapshot</h3>
              <button onClick={resetAnalysis} className="text-xs text-blue-400 hover:text-blue-300 font-medium py-1 px-3 bg-blue-500/10 rounded-full border border-blue-500/20">Edit Data</button>
            </div>

            {/* Savings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-5">
                 <p className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 font-semibold">Monthly Income</p>
                 <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(income)}</p>
               </div>
               <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-5">
                 <p className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 font-semibold">Monthly Expenses</p>
                 <p className="text-2xl font-bold text-slate-300 tracking-tight">{formatCurrency(expenses)}</p>
               </div>
               <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/20 border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden">
                 <div className="relative z-10">
                   <p className="text-xs text-emerald-400 uppercase tracking-widest mb-1.5 font-semibold">Monthly Savings</p>
                   <p className="text-3xl font-extrabold text-emerald-300 tracking-tight">{formatCurrency(savings)}</p>
                   <p className="text-[11px] text-emerald-500 mt-1 font-medium tracking-wide">{(income > 0 ? ((savings/income)*100).toFixed(0) : 0)}% of income saved</p>
                 </div>
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <PieChart className="w-24 h-24" />
                 </div>
               </div>
            </div>

            {/* Chart */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <LineChartIcon className="w-4 h-4 text-emerald-400" />
                  12-Month Projected Savings Growth
                </h4>
                <p className="text-xs text-slate-500 mt-1">If you maintain your current savings rate, here is how your cash will grow.</p>
              </div>
              
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={graphData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `NPR ${value / 1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '13px' }}
                      itemStyle={{ fontWeight: 'bold' }}
                      formatter={(value: any, name: any) => [
                        formatCurrency(Number(value) || 0), 
                        name === "savings" ? "Savings" : name === "income" ? "Income" : "Expenses"
                      ]}
                    />
                    <Area type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" name="Expenses" />
                    <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" name="Savings" />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">What's your next goal?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SUGGESTIONS.map((sug) => {
                  const Icon = sug.icon;
                  return (
                    <button
                      key={sug.id}
                      onClick={() => handleCardClick(sug.id, sug.title)}
                      className="text-left rounded-2xl p-5 border transition-all duration-200 group relative overflow-hidden bg-slate-900/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700"
                    >
                       <div className={`h-10 w-10 flex items-center justify-center rounded-xl border ${sug.bg} mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-5 h-5 ${sug.color}`} />
                       </div>
                       <h4 className="text-white font-semibold text-sm mb-1">{sug.title}</h4>
                       <p className="text-xs text-slate-500 leading-relaxed pr-4">{sug.desc}</p>
                    </button>
                  );
                })}
              </div>

              {generatedPrompt && (
                <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
                  <p className="text-xs text-blue-300 font-semibold uppercase tracking-wider">
                    Ready Prompt
                  </p>
                  <p className="text-xs text-slate-400">
                    Copy this prompt and paste it into the AI Assistant chat.
                  </p>
                  <textarea
                    value={generatedPrompt}
                    readOnly
                    className="w-full h-40 rounded-xl bg-slate-900/70 border border-slate-700 text-slate-200 text-xs p-3 leading-relaxed focus:outline-none"
                  />
                  <button
                    onClick={handleCopyPrompt}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
                  >
                    {copied ? "Copied" : "Copy Prompt"}
                  </button>
                </div>
              )}
            </div>

            {/* Removed internal Smart Loan Manual UI — Handled via AI Assistant now */}

          </motion.div>
        )}

      </div>
    </div>
  );
}
