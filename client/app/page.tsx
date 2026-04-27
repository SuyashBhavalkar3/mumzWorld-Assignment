// ==========================================
// MUMZ-SHIELD AI FRONTEND (Next.js)
// ==========================================
// This dashboard provides a professional UI for parents to
// audit product ingredients using AI.
//
// KEY FEATURES:
// 1. Bilingual Support (English/Arabic)
// 2. Real-time AI processing logs
// 3. Dynamic layout (Centered -> Split)
// 4. Sticky Sidebar for easy access

"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Upload, ShieldCheck, AlertCircle, Info, Sparkles, CheckCircle2, Languages } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [loadingMsg, setLoadingMsg] = useState("Initializing AI...");

  const loadingSteps = [
    "Initializing Vision Engine...",
    "Extracting Ingredient List...",
    "Analyzing Chemical Safety...",
    "Cross-referencing GCC Standards...",
    "Generating Bilingual Verdict...",
    "Finalizing Safety Passport..."
  ];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // Cycle messages
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % loadingSteps.length;
      setLoadingMsg(loadingSteps[step]);
    }, 1500);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Use environment variable for deployment, fallback to local for development
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch (err) {
      setError("Could not connect to backend server");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <Header />

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black mb-4 border border-white/10"
          >
            <Sparkles size={12} className="text-accent" />
            AI-POWERED SAFETY SENTINEL
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
            SafeStart with <span className="text-accent italic">Mumz-Shield</span>
          </h1>
          <p className="text-base opacity-80 max-w-2xl mx-auto font-medium">
            Verify product safety from a photo. Built for 100% peace of mind.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-10">
        <div className={`grid grid-cols-1 gap-8 items-start transition-all duration-700 ${result || loading ? 'lg:grid-cols-12' : 'max-w-3xl mx-auto'}`}>
          
          {/* Upload Sidebar - Centered if no results */}
          <div className={`${result || loading ? 'lg:col-span-4 lg:sticky lg:top-24' : 'w-full'}`}>
            <div className="glass-card p-6 border-white/40 shadow-2xl">
              <h3 className="font-black text-primary mb-4 flex items-center gap-2 text-sm tracking-tight">
                <Upload size={18} />
                PRODUCT INGESTION
              </h3>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div 
                  className={`border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-primary/30 transition-all cursor-pointer bg-white/50 group ${result || loading ? 'aspect-square' : 'h-48'}`}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  {file ? (
                    <div className="text-center p-4">
                      <CheckCircle2 className="mx-auto text-secondary mb-2" size={32} />
                      <p className="text-[10px] font-bold text-mumz-grey truncate max-w-[150px]">{file.name}</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="text-primary" size={20} />
                      </div>
                      <p className="text-[9px] font-black text-gray-300 tracking-widest uppercase">Click to scan label</p>
                    </>
                  )}
                  <input 
                    id="file-upload"
                    type="file" 
                    hidden 
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>

                <button 
                  disabled={!file || loading}
                  className="w-full h-12 bg-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:translate-y-[-2px] active:translate-y-[0px] transition-all disabled:opacity-50"
                >
                  {loading ? "SCANNING..." : "START AI AUDIT"}
                </button>
              </form>

              <div className="mt-6 p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                <p className="text-[10px] leading-relaxed text-secondary font-bold flex items-start gap-2">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  AI analyzes for GCC compliance, chemical safety, and pediatric suitability.
                </p>
              </div>
            </div>
          </div>

          {/* Results Main Area */}
          {(loading || result || error) && (
            <div className="lg:col-span-8 min-h-[600px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loader"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[500px] border-white shadow-xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none animate-pulse" />
                  <div className="w-32 h-32 relative mb-8">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                    <ShieldCheck size={48} className="absolute inset-0 m-auto text-primary animate-pulse" />
                  </div>
                  <h3 className="font-black text-xl text-mumz-grey mb-2 uppercase tracking-tighter">AI AGENT ACTIVE</h3>
                  <div className="h-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-bounce">
                      {loadingMsg}
                    </p>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[500px]"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <AlertCircle size={32} className="text-primary" />
                  </div>
                  <h3 className="font-black text-xl text-mumz-grey mb-2 uppercase tracking-tighter">Analysis Error</h3>
                  <p className="text-sm font-bold text-gray-400 max-w-xs">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="mt-6 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    Try again
                  </button>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* ... results content ... */}
                  {/* Top Score Card */}
                  <div className="glass-card overflow-hidden border-white shadow-2xl">
                    <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-50">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-4">
                          <button 
                            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                            className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full text-[9px] font-black text-gray-400 hover:bg-primary/10 hover:text-primary transition-all border border-gray-100"
                          >
                            <Languages size={12} />
                            {lang === 'en' ? "SWITCH TO ARABIC" : "SWITCH TO ENGLISH"}
                          </button>
                        </div>
                        <h2 className={`text-3xl font-black text-mumz-grey tracking-tight leading-none ${lang === 'ar' ? 'text-right' : ''}`}>
                          {lang === 'en' ? result.product_name_en : result.product_name_ar}
                        </h2>
                        <div className={`flex flex-wrap gap-1.5 mt-4 ${lang === 'ar' ? 'justify-end' : ''}`}>
                          {result.trust_badges.map((badge: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-secondary/10 text-secondary text-[9px] font-black rounded tracking-wider">
                              {badge.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-24 h-24 rounded-full border-[8px] border-secondary flex items-center justify-center bg-white shadow-inner">
                          <span className="text-3xl font-black text-secondary">{result.safety_score}</span>
                        </div>
                        <span className="text-[9px] font-black mt-3 text-gray-400 tracking-widest">SAFETY INDEX</span>
                      </div>
                    </div>
                    
                    <div className="p-8 bg-gray-50/30">
                      <h4 className={`text-[10px] font-black text-gray-400 mb-3 tracking-[0.2em] uppercase ${lang === 'ar' ? 'text-right' : ''}`}>
                        {lang === 'en' ? "EXPERT VERDICT" : "حكم الخبراء"}
                      </h4>
                      <p className={`text-sm leading-relaxed text-mumz-grey font-semibold ${lang === 'ar' ? 'text-right dir-rtl' : ''}`}>
                        {lang === 'en' ? result.summary_en : result.summary_ar}
                      </p>
                    </div>
                  </div>

                  {/* Ingredients List */}
                  <div className="glass-card p-8 shadow-2xl border-white">
                    <h3 className={`font-black text-primary mb-8 flex items-center gap-2 text-sm tracking-tight ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <ShieldCheck size={20} />
                      {lang === 'en' ? "INGREDIENT SAFETY ANALYSIS" : "تحليل سلامة المكونات"}
                    </h3>
                    <div className="divide-y divide-gray-50">
                      {result.ingredients.map((ing: any, i: number) => (
                        <div key={i} className={`py-5 flex items-start gap-4 transition-all group ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-sm ${
                            ing.safety_rating === 'Safe' ? 'bg-secondary' : 
                            ing.safety_rating === 'Caution' ? 'bg-accent' : 'bg-primary'
                          }`} />
                          <div className="flex-grow">
                            <div className={`flex justify-between items-center mb-1.5 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                              <span className="font-bold text-sm text-mumz-grey group-hover:text-primary transition-colors">
                                {lang === 'en' ? ing.name_en : ing.name_ar}
                              </span>
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                                ing.safety_rating === 'Safe' ? 'bg-secondary/5 border-secondary/20 text-secondary' : 
                                ing.safety_rating === 'Caution' ? 'bg-accent/10 border-accent/20 text-accent-foreground' : 'bg-primary/5 border-primary/20 text-primary'
                              }`}>
                                {ing.safety_rating.toUpperCase()}
                              </span>
                            </div>
                            <p className={`text-xs text-gray-400 font-medium leading-relaxed max-w-2xl ${lang === 'ar' ? 'text-right' : ''}`}>
                              {lang === 'en' ? ing.reason_en : ing.reason_ar}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        
        .dir-rtl { direction: rtl; }
      `}</style>
    </main>
  );
}
