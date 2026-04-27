# 🏗️ Architecture & Tradeoffs: Mumz-Shield

This document explains the strategic engineering choices made during the 5-hour build of the Mumz-Shield prototype.

## 🧠 Problem Selection
**The Trust Gap:** Many parents in the GCC buy international brands but struggle to verify ingredients written in complex chemical terms or English-only labels. 
**Why this over a Gift Finder?** A Gift Finder is a "nice to have." A Safety Sentinel is a "Must have." It solves a high-anxiety pain point (Is this lotion safe for my baby's rash?), making it a higher-leverage AI feature for Mumzworld.

---

## 🛠️ The Stack
- **Frontend:** Next.js 16 (App Router) + Tailwind CSS 4.
- **Backend:** FastAPI (Python).
- **AI Model:** GPT-4o-mini via OpenAI Vision.
- **Validation:** Pydantic (v1.10).

---

## ⚖️ Strategic Tradeoffs

### 1. Model: GPT-4o-mini vs. GPT-4o
- **Choice:** GPT-4o-mini.
- **Why:** For ingredient extraction, we don't need the reasoning power of a $100B model. GPT-4o-mini provides **90% of the accuracy at 1/10th the cost and 2x the speed**. For a customer-facing feature, latency (speed) is a feature.

### 2. Validation: Pydantic v1 vs. v2
- **Choice:** Pydantic v1.
- **Why:** During development on Windows, we encountered a common binary execution block with Pydantic v2's Rust-based DLLs. To ensure this project is **truly portable** and runs on any hiring manager's machine in under 5 minutes, we downgraded to v1.10. 
- **Tradeoff:** We lose some speed in serialization, but we gain 100% reliability in setup.

### 3. UI: Dashboard vs. Chatbot
- **Choice:** Professional Dashboard.
- **Why:** Chatbots are often "fluff." For safety data, users want structured lists, risk badges, and clear scores. We prioritized a **"Medical UI"** over a conversational one to increase the feeling of authority and trust.

---

## 🛡️ Uncertainty Handling
The system uses a **Triple-Check Logic**:
1. **Scope Check:** The system prompt instructs the AI to immediately flag `is_in_scope: false` if the image isn't a baby product.
2. **Confidence Scoring:** The AI returns a `confidence_score`. If this is low, the UI warns the user.
3. **Explicit Refusal:** Unlike "Vibe-based" AI, Mumz-Shield is told: *"If you cannot see the text clearly, say so. Do not guess."*

---

## 🚀 What's Next? (Scaling to 5% Experiment)
1. **Batch Review Synthesis:** Connect this to 200+ product reviews to add a "Moms' Verdict" section to the safety audit.
2. **Side-by-Side Comparison:** Allow parents to upload TWO photos to see which lotion is safer.
3. **Fine-tuning:** Fine-tune a model on specific GCC Pediatric safety guidelines for even higher precision.
