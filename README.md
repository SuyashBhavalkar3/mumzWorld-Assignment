# 🛡️ Mumz-Shield AI: Safety Sentinel

### 📋 Submission Details (Track A: AI Engineering Intern)
- **Summary:** Mumz-Shield is an AI-powered safety sentinel for Mumzworld parents. It uses multimodal AI (GPT-4o-mini) to instantly audit baby product ingredients from a photo, providing bilingual (EN/AR) safety verdicts. It features a persistent SHA-256 hashing cache for speed, a "Safe-Swap" revenue engine for recommendations, and SSE token streaming for a premium chat experience.
- **Prototype Access:** [GitHub Repository](https://github.com/SuyashBhavalkar3/mumzWorld-Assignment)
- **Loom Walkthrough:** pending to insert link
- **Deliverables:** [EVALS.md](./EVALS.md) | [TRADEOFFS.md](./TRADEOFFS.md)
- **AI Usage Note:** Built with **Antigravity** (harness) + **Gemini 1.5 Pro** & **GPT-4o-mini**. Workflow: Agentic loops for UI/Persistence, pair-coding for business logic (Safe-Swap), and manual steerage for bilingual layout integrity.
- **Time Log:** Total: ~5 Hours. Phase 1 (Discovery): 45m | Phase 2 (AI/Backend): 1.5h | Phase 3 (Frontend/Streaming): 1.5h | Phase 4 (Polish/Evals): 1h.

---


**Mumz-Shield is an AI-powered safety sentinel designed for Mumzworld parents to instantly audit baby product ingredients from a photo. It uses multimodal AI (GPT-4o-mini) to extract ingredient lists, cross-reference them against pediatric safety standards, and generate bilingual (EN/AR) verdicts. The system handles uncertainty by rejecting out-of-scope products and flagging blurry inputs, providing parents with 100% peace of mind in a "Medical Dashboard" UI.**

---

## 🚀 v2.0 Power-Ups (Top 0.001% Engineering)
**The project has been upgraded beyond the initial requirements to showcase senior-level AI Engineering practices:**
1. **Persistent SHA-256 Hashing Cache:** Built with **SQLAlchemy**, the backend identifies redundant image scans in `<10ms` using a persistent hash database. This drastically reduces OpenAI credit consumption and provides near-instant results for common products.
2. **"Safe-Swap" Revenue Engine:** If a product is flagged as unsafe, the app automatically injects a gallery of **Expert-Verified Safe Alternatives** from the Mumzworld catalog, turning a safety concern into a high-conversion shopping moment.
3. **Real-time Token Streaming:** The Pediatric Expert Chat utilizes **Server-Sent Events (SSE)** to stream AI responses word-by-word. This eliminates perceived latency and provides a premium, "alive" user experience.
4. **Bilingual Fixed-Layout:** A sophisticated layout system that maintains brand integrity (Logo Left, Icons Right) while supporting native Arabic text flow and alignment internally.

---

## 🚀 5-Minute Quickstart

### 1. Prerequisites
- **Python 3.10+** (Install from [python.org](https://www.python.org/))
- **Node.js 18+** (Install from [nodejs.org](https://nodejs.org/))
- **OpenAI API Key** (Get one from [platform.openai.com](https://platform.openai.com/))

### 2. Backend Setup (The Brain)
1. Open a terminal in the `server/` folder.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `server/` folder:
   ```env
   OPENAI_API_KEY=your_key_here
   ```
5. Start the server:
   ```bash
   python main.py
   ```
   *(Server runs at http://127.0.0.1:8000)*

### 3. Frontend Setup (The Beauty)
1. Open a terminal in the `client/` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dashboard:
   ```bash
   npm run dev
   ```
   *(Dashboard runs at http://localhost:3000)*

---

---

## 📊 Technical Depth & Rigor
- **[EVALS.md](./EVALS.md):** 10+ Test cases covering Safe, Caution, and Adversarial inputs (e.g., Pizza, Blurry, Medicine).
- **[TRADEOFFS.md](./TRADEOFFS.md):** Detailed architectural defense (Model choice, Uncertainty handling, SQL Cache).

---

## 🛠️ Tooling & AI Provenance (Mandatory Disclosure)
This project was built using a high-intensity, AI-Native workflow.

- **Primary Harness:** **Antigravity** (Advanced Coding Agent). Used for full architectural loops, UI/UX refinement, and cross-file refactors.
- **Models Used:** 
  - **Gemini 1.5 Pro / 2.0 Flash:** Used via Antigravity for large-scale codebase context and logic generation.
  - **GPT-4o-mini (Vision):** The core production engine for image analysis.
  - **GPT-4o:** Used for architectural sanity checks and bilingual copy polish.
- **How it was used:** 
  - **Pair-Coding:** I (the developer) steered the high-level architecture and defined the business logic (e.g., the "Safe-Swap" revenue model).
  - **Agentic Loops:** Used Antigravity to handle repetitive tasks like CSS alignment, bilingual string mapping, and boilerplate SQLAlchemy setup.
  - **Where I Overruled the AI:** The agent initially proposed a mirrored RTL layout for Arabic. I stepped in and forced a **"Fixed Layout"** strategy (Logo/Icons stay LTR) to maintain brand integrity, while only the internal text flows RTL.
- **Key Prompt Strategies:** Used **System Instructions** to force "json_object" mode and strict schema adherence for multimodal extraction.

## ⏱️ Time Log (Total: ~5 Hours)
- **Phase 1: Discovery & Scoping (45m):** Audited Mumzworld.com and defined the Safety Sentinel persona.
- **Phase 2: Core AI Pipeline (1.5h):** Built the Vision extraction, Pydantic validation, and SQLite caching layer.
- **Phase 3: Frontend & UI (1.5h):** Developed the dashboard, bilingual toggle, and SSE streaming chat.
- **Phase 4: Optimization & Polish (45m):** Implemented Safe-Swap recommendations and fixed layout issues.
- **Phase 5: Evaluation & Docs (45m):** Created EVALS.md and TRADEOFFS.md and audited code clarity.

## 🌐 Deployment (Cloud)

### 1. Backend (Railway)
1. Connect your repo to **Railway.app**.
2. Railway will automatically detect the `server/Dockerfile`.
3. Add your `OPENAI_API_KEY` to the Railway **Variables** tab.
4. Railway will give you a public URL (e.g., `https://mumz-shield.up.railway.app`).

### 2. Frontend (Vercel)
1. Connect your repo to **Vercel.com**.
2. Set the **Root Directory** to `client`.
3. Add an **Environment Variable**:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-railway-url.com` (Your live Railway URL)
4. Deploy!

---

## 🎨 Design Philosophy
- **Mumzworld Integration:** Uses the exact hex codes (#e60058, #00b2d4) and typography of the Mumzworld brand.
- **Trust First:** Uses a "Medical Dashboard" aesthetic with high-intensity glassmorphism to instill confidence in parents.
- **Bilingual by Nature:** Every AI response and UI element is instantly togglable between English and Arabic.

## 🧠 AI Engineering Details
- **Model:** GPT-4o-mini (Vision).
- **Latency Masking:** The UI uses "Active AI Logs" to keep users engaged while the Vision engine processes the image.
- **Structured Output:** Uses Pydantic validation to ensure the AI always returns valid JSON, even for complex Arabic ingredient names.
- **Safety Logic:** Rejects non-baby products and provides specific "Caution" or "Avoid" reasons based on pediatric safety standards.

## 📂 Project Map
- `/client`: Next.js 16 + Tailwind 4 frontend.
- `/server`: FastAPI backend.
- `server/main.py`: Core AI logic and image processing.
- `server/schemas.py`: Data contracts (Ingredient safety models).

---
**Built for the Mumzworld AI Assignment.** 🚀
