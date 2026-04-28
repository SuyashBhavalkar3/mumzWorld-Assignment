// ==========================================
// MUMZ-SHIELD AI FRONTEND (Next.js)
// ==========================================
// This dashboard provides a professional UI for parents to
// audit product ingredients using AI.
//
// KEY FEATURES:
// 1. Bilingual Support (English/Arabic)
// 2. Real-time AI processing logs (Vision Engine)
// 3. Persistent SHA-256 Hashing Cache (SQLAlchemy)
// 4. Real-time Token Streaming Chat (SSE)
// 5. Safe-Swap Revenue Integration

"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Upload, ShieldCheck, AlertCircle, Info, Sparkles, CheckCircle2, Languages, Send, MessageSquare } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [loadingMsg, setLoadingMsg] = useState("Initializing AI...");
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);


  const t = {
    en: {
      title: "Product Ingestion",
      uploadPrompt: "Click to scan label",
      button: "Start AI Audit",
      scanning: "Scanning...",
      info: "AI analyzes for GCC compliance, chemical safety, and pediatric suitability.",
      errorTitle: "Analysis Error",
      tryAgain: "Try again",
      safetyIndex: "SAFETY INDEX",
      expertVerdict: "EXPERT VERDICT",
      ingredientAnalysis: "INGREDIENT SAFETY ANALYSIS",
      switchLang: "SWITCH TO ARABIC",
      aiAgent: "AI AGENT ACTIVE",
      chatTitle: "Ask a Pediatric Expert",
      chatPlaceholder: "Is this safe for eczema? Ask here...",
      send: "Send",
      safeSwapTitle: "MUMZ-SHIELD SAFE SWAP",
      safeSwapSubtitle: "Expert-verified safe alternatives from our catalog"
    },
    ar: {
      title: "إدخال المنتج",
      uploadPrompt: "انقر لمسح الملصق",
      button: "بدء تدقيق الذكاء الاصطناعي",
      scanning: "جاري المسح...",
      info: "يقوم الذكاء الاصطناعي بالتحليل للامتثال لمجلس التعاون الخليجي والسلامة الكيميائية والملاءمة للأطفال.",
      errorTitle: "خطأ في التحليل",
      tryAgain: "حاول مرة أخرى",
      safetyIndex: "مؤشر السلامة",
      expertVerdict: "حكم الخبراء",
      ingredientAnalysis: "تحليل سلامة المكونات",
      switchLang: "التبديل إلى الإنجليزية",
      aiAgent: "وكيل الذكاء الاصطناعي نشط",
      chatTitle: "اسأل خبير طب الأطفال",
      chatPlaceholder: "هل هذا آمن للأكزيما؟ اسأل هنا...",
      send: "إرسال",
      safeSwapTitle: "تبديل آمن من درع الذكاء الاصطناعي",
      safeSwapSubtitle: "بدائل آمنة معتمدة من قبل الخبراء من كتالوجنا"
    }
  };


  const loadingSteps = {
    en: [
      "Initializing Vision Engine...",
      "Extracting Ingredient List...",
      "Analyzing Chemical Safety...",
      "Cross-referencing GCC Standards...",
      "Generating Bilingual Verdict...",
      "Finalizing Safety Passport..."
    ],
    ar: [
      "تهيئة محرك الرؤية...",
      "استخراج قائمة المكونات...",
      "تحليل السلامة الكيميائية...",
      "مقارنة معايير دول مجلس التعاون الخليجي...",
      "توليد الحكم ثنائي اللغة...",
      "الانتهاء من جواز السفر السلامة..."
    ]
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // Cycle messages
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % loadingSteps[lang].length;
      setLoadingMsg(loadingSteps[lang][step]);
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !result) return;

    const userMessage = { role: "user", content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsChatting(true);

    // Add a placeholder for the assistant's response
    const assistantMessageIndex = chatMessages.length + 1;
    setChatMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportContext: result,
          messages: [...chatMessages, userMessage]
        }),
      });

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantReply = "";

      // ---------------------------------------------------------
      // SSE STREAM DECODER: Reads tokens from backend iteratively.
      // This enables the "Real-time Typing" effect in the UI.
      // ---------------------------------------------------------
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const content = line.replace("data: ", "");
            if (content === "[DONE]") break;
            
            assistantReply += content;
            // Update the last message in the chat history
            setChatMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = { 
                role: "assistant", 
                content: assistantReply 
              };
              return newMessages;
            });
          }
        }
      }
    } catch (err) {
      console.error("Streaming error:", err);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <Header lang={lang} setLang={setLang} />

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
                {t[lang].title}
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
                      <p className="text-[9px] font-black text-gray-300 tracking-widest uppercase">{t[lang].uploadPrompt}</p>
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
                  {loading ? t[lang].scanning : t[lang].button}
                </button>
              </form>

              <div className="mt-6 p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                <p className="text-[10px] leading-relaxed text-secondary font-bold flex items-start gap-2">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  {t[lang].info}
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
                  <h3 className="font-black text-xl text-mumz-grey mb-2 uppercase tracking-tighter">{t[lang].aiAgent}</h3>
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
                  <h3 className="font-black text-xl text-mumz-grey mb-2 uppercase tracking-tighter">{t[lang].errorTitle}</h3>
                  <p className="text-sm font-bold text-gray-400 max-w-xs">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="mt-6 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    {t[lang].tryAgain}
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
                        <span className="text-[9px] font-black mt-3 text-gray-400 tracking-widest">{t[lang].safetyIndex}</span>
                      </div>
                    </div>
                    
                    <div className="p-8 bg-gray-50/30">
                      <h4 className={`text-[10px] font-black text-gray-400 mb-3 tracking-[0.2em] uppercase ${lang === 'ar' ? 'text-right' : ''}`}>
                        {t[lang].expertVerdict}
                      </h4>
                      <p className={`text-sm leading-relaxed text-mumz-grey font-semibold ${lang === 'ar' ? 'text-right dir-rtl' : ''}`}>
                        {lang === 'en' ? result.summary_en : result.summary_ar}
                      </p>
                    </div>
                  </div>

                  {/* Ingredients List */}
                  <div className="glass-card p-8 shadow-2xl border-white">
                    <h3 className="font-black text-primary mb-8 flex items-center gap-2 text-sm tracking-tight">
                      <ShieldCheck size={20} />
                      {t[lang].ingredientAnalysis}
                    </h3>
                    <div className="divide-y divide-gray-50">
                      {result.ingredients.map((ing: any, i: number) => (
                        <div key={i} className="py-5 flex items-start gap-4 transition-all group">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-sm ${
                            ing.safety_rating === 'Safe' ? 'bg-secondary' : 
                            ing.safety_rating === 'Caution' ? 'bg-accent' : 'bg-primary'
                          }`} />
                          <div className="flex-grow">
                            <div className="flex justify-between items-center mb-1.5">
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

                  {result.recommendations && result.recommendations.length > 0 && (
                    <div className="space-y-6 mt-12 mb-12">
                      <div className={`px-4 ${lang === 'ar' ? 'text-right' : ''}`}>
                        <h3 className="text-sm font-black text-white tracking-widest uppercase drop-shadow-md">{t[lang].safeSwapTitle}</h3>
                        <p className="text-[11px] font-bold text-white/70 mt-1">{t[lang].safeSwapSubtitle}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.recommendations.map((rec: any, i: number) => (
                          <motion.div 
                            key={i}
                            whileHover={{ y: -5 }}
                            className="glass-card overflow-hidden border-white shadow-xl flex flex-col h-full group"
                          >
                            <div className="relative aspect-square overflow-hidden bg-white p-6">
                              <img 
                                src={rec.image_url} 
                                alt={rec.name} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                              />
                              <div className="absolute top-4 right-4 bg-accent text-[8px] font-black px-2 py-1 rounded-full text-mumz-grey shadow-sm">
                                {rec.price}
                              </div>
                            </div>
                            
                            <div className="p-5 flex-grow flex flex-col">
                              <span className="text-[9px] font-black text-secondary tracking-widest uppercase mb-1">{rec.brand}</span>
                              <h4 className="text-xs font-black text-mumz-grey mb-2 line-clamp-2">{rec.name}</h4>
                              <p className="text-[10px] text-gray-400 font-medium leading-relaxed mb-4 flex-grow italic">
                                "{rec.reason}"
                              </p>
                              
                              <a 
                                href={rec.product_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full h-10 bg-gray-50 text-primary border border-gray-100 rounded-lg flex items-center justify-center gap-2 text-[10px] font-black hover:bg-primary hover:text-white transition-all uppercase tracking-widest"
                              >
                                View on Mumzworld
                              </a>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pediatric Expert Chat */}
                  <div className="glass-card overflow-hidden shadow-2xl border-white mt-8">
                    <div className="p-6 bg-gradient-to-r from-primary to-accent border-b border-white/20">
                      <h3 className="font-black text-white flex items-center gap-2 tracking-tight">
                        <MessageSquare size={20} />
                        {t[lang].chatTitle}
                      </h3>
                    </div>
                    
                    <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto bg-gray-50/50">
                      {chatMessages.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest opacity-50">
                            {lang === 'en' ? 'Start a conversation' : 'ابدأ محادثة'}
                          </p>
                        </div>
                      )}
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm font-medium leading-relaxed ${
                            msg.role === 'user' 
                              ? 'bg-secondary text-white shadow-lg shadow-secondary/20 rounded-tr-sm' 
                              : 'bg-white text-mumz-grey shadow-md border border-gray-100 rounded-tl-sm'
                          } ${lang === 'ar' ? 'text-right dir-rtl' : ''}`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isChatting && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-md flex gap-1">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-3 items-center">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={t[lang].chatPlaceholder}
                        className={`flex-grow h-12 bg-gray-50 border-none rounded-xl px-5 focus:ring-2 focus:ring-primary/20 text-sm transition-all ${lang === 'ar' ? 'text-right' : ''}`}
                      />
                      <button 
                        type="submit"
                        disabled={!chatInput.trim() || isChatting}
                        className="h-12 w-12 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50 shrink-0 shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <Send size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
                      </button>
                    </form>
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
