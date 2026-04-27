# 🛡️ Mumz-Shield AI: Safety Sentinel

**Mumz-Shield is an AI-powered safety sentinel designed for Mumzworld parents to instantly audit baby product ingredients from a photo. It uses multimodal AI (GPT-4o-mini) to extract ingredient lists, cross-reference them against pediatric safety standards, and generate bilingual (EN/AR) verdicts. The system handles uncertainty by rejecting out-of-scope products and flagging blurry inputs, providing parents with 100% peace of mind in a "Medical Dashboard" UI.**

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

## 📊 Evaluation & Tradeoffs
- **[EVALS.md](./EVALS.md):** 10+ Test cases covering Safe, Caution, and Adversarial inputs.
- **[TRADEOFFS.md](./TRADEOFFS.md):** Detailed explanation of Architecture, Model choice, and Uncertainty handling.

---

## 🛠️ Tooling & AI Usage
- **Harness:** **Antigravity** (Powerful agentic assistant) for architecture scaffolding, pair-coding, and UI refinement.
- **Models:** **GPT-4o-mini** for the production Vision engine (chosen for speed/cost) and **GPT-4o** for architectural guidance.
- **Workflow:** Heavy pair-coding with real-time refactoring. AI was used to generate the initial FastAPI boilerplate and complex Tailwind 4 animations, while the developer (me) stepped in to solve Windows-specific Pydantic binary blocks and brand-specific CSS integrity.

## ⏱️ Time Log
- **Discovery & Scoping (1h):** Identified the "Trust-Verification Gap" and audited `mumzworld.com` for brand colors/typography.
- **Backend & AI Pipeline (1.5h):** Built the FastAPI server, image encoding pipeline, and Pydantic validation logic.
- **Frontend & UI (1.5h):** Developed the Next.js 16 dashboard, bilingual toggle, and sticky audit sidebar.
- **Documentation & Evals (1h):** Formalized evaluation metrics and wrote setup documentation.
- **Total:** 5 Hours.

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
