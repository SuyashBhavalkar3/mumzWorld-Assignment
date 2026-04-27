# 🛡️ Mumz-Shield AI: Safety Sentinel

> **The ultimate safety companion for Mumzworld parents.**
> Use AI to instantly verify baby product ingredients, safety scores, and GCC compliance from a single photo.

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
