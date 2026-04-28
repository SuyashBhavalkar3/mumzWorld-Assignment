# ==========================================
# MUMZ-SHIELD AI BACKEND (FastAPI)
# ==========================================
# This server handles image processing and AI safety audits.
# It uses OpenAI's Vision models to analyze product labels.

import os
import base64
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import json
import hashlib
from sqlalchemy import Column, String, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from schemas import AnalysisResponse, SafetyReport, ChatRequest, ChatResponse

# --- DATABASE SETUP (SQLAlchemy) ---
# Supports Local SQLite and External Postgres (Render)
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./cache.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ProductCache(Base):
    __tablename__ = "product_cache"
    image_hash = Column(String, primary_key=True, index=True)
    analysis_data = Column(Text)

Base.metadata.create_all(bind=engine)

def get_cached_result(image_hash):
    db = SessionLocal()
    try:
        cached = db.query(ProductCache).filter(ProductCache.image_hash == image_hash).first()
        return json.loads(cached.analysis_data) if cached else None
    finally:
        db.close()

def set_cached_result(image_hash, data):
    db = SessionLocal()
    try:
        new_cache = ProductCache(image_hash=image_hash, analysis_data=json.dumps(data))
        db.merge(new_cache) # Merges if exists, otherwise inserts
        db.commit()
    finally:
        db.close()

# Load environment variables (like OPENAI_API_KEY) from .env file
load_dotenv()

app = FastAPI(title="Mumz-Shield Safety API")

@app.get("/")
def read_root():
    """
    Root endpoint so users don't see a 'Not Found' error.
    Provides basic app details.
    """
    return {
        "app_name": "Mumz-Shield Safety API",
        "description": "AI-powered product safety analysis for Mumzworld.",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs (Swagger UI)",
            "health": "/health",
            "analyze": "/analyze",
            "chat": "/chat"
        }
    }

# ---------------------------------------------------------
# CORS SETTINGS: Trusting our specific frontend URLs
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://mumz-world-assignment.vercel.app"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def encode_image(image_bytes):
    return base64.b64encode(image_bytes).decode('utf-8')

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_product(file: UploadFile = File(...)):
    """
    Main Endpoint: Accepts a product label image and returns a Safety Audit.
    1. Reads the image file.
    2. Encodes it to Base64 for OpenAI.
    3. Prompts GPT-4o-mini to extract and analyze ingredients.
    4. Validates the output against our SafetyReport schema.
    """
    try:
        # Step 1: Process and Hash the image file
        contents = await file.read()
        image_hash = hashlib.sha256(contents).hexdigest()
        
        # Step 1.5: Check Persistent Cache
        cached_data = get_cached_result(image_hash)
        if cached_data:
            print(f"⚡ PERSISTENT CACHE HIT: Returning saved result for {image_hash[:8]}...")
            analysis = SafetyReport(**cached_data)
            return AnalysisResponse(success=True, data=analysis, error=None)

        print(f"☁️ CACHE MISS: Calling OpenAI Vision for {image_hash[:8]}...")
        base64_image = encode_image(contents)

        # Step 2: Request Analysis from OpenAI
        # We use 'json_object' mode to ensure the AI speaks in structured data.
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a Mumzworld Safety Expert. Analyze product images "
                        "and provide a structured safety audit in JSON format. "
                        "Scope: ALL baby products including Food, Formula, Skin-care (Lotion/Cream), Hygiene (Shampoo/Diaper), and Medicine. "
                        "If the image is NOT one of these (e.g., car parts, industrial chemicals, home tools), "
                        "set is_in_scope to false and provide a helpful error message in the summary. "
                        "Follow the schema: product_name_en, product_name_ar, safety_score (0-10), "
                        "risk_level (Low/Medium/High), ingredients (list of objects with name_en, name_ar, "
                        "safety_rating (MUST BE ONE OF: 'Safe', 'Caution', 'Avoid'), reason_en, reason_ar), "
                        "summary_en, summary_ar, trust_badges (list), is_in_scope (bool), confidence_score (float)."
                    )
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Analyze this product for safety and ingredients. Return JSON."},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                        },
                    ],
                }
            ],
            response_format={"type": "json_object"},
        )

        # Step 3: Parse and Validate the AI output
        raw_content = response.choices[0].message.content
        data = json.loads(raw_content)
        
        # We use manual validation here because Pydantic v2 has binary issues on some Windows setups.
        # This approach (Pydantic v1) is the most robust for local distribution.
        
        # Step 3.5: Inject Safe-Swap Recommendations if score is low
        if data.get("safety_score", 10) <= 7:
            data["recommendations"] = [
                {
                    "name": "Mustela Gentle Cleansing Gel",
                    "brand": "Mustela",
                    "image_url": "https://s3-pwa-prod.mumzworld.com/media/cGF0aD0lMkZtZWRpYSUyRmNhdGFsb2clMkZwcm9kdWN0JTJGQVNLLTg3MDI4MzktMi5qcGcmZml0PWNvdmVyJndpZHRoPTY0MA/Mustela%20Gentle%20Cleansing%20Gel%20-%20500ml.webp",
                    "product_url": "https://www.mumzworld.com/en/mustela-gentle-cleansing-gel-500ml",
                    "price": "AED 65.00",
                    "reason": "Dermatologically tested, Soap-free, and contains 93% natural ingredients."
                },
                {
                    "name": "Sebamed Baby Gentle Wash",
                    "brand": "Sebamed",
                    "image_url": "https://s3-pwa-prod.mumzworld.com/media/cGF0aD0lMkZtZWRpYSUyRmNhdGFsb2clMkZwcm9kdWN0JTJGYyUyRnAlMkZjcGMtNDEwMzA0MDAyNjk4OS1zZWJhbWVkLWJhYnktZ2VudGxlLXdhc2gtd2l0aC1jYWxlbmR1bGEtMjAwbWwtMTU1NjIxMTk4OS5qcGcmZml0PWNvdmVyJndpZHRoPTY0MA/Sebamed%20-%20Baby%20Gentle%20Wash%20with%20Calendula%20200ml.webp",
                    "product_url": "https://www.mumzworld.com/en/sebamed-baby-gentle-wash-with-calendula-200ml?source=Smart+404+page",
                    "price": "AED 42.50",
                    "reason": "pH 5.5 helps develop the skin's acid protection mantle."
                }
            ]
        else:
            data["recommendations"] = []

        analysis = SafetyReport(**data)
        
        if not analysis.is_in_scope:
            return AnalysisResponse(
                success=True, 
                data=None, 
                error="This product is outside our safety audit scope. Please upload a baby-related consumable or skin-care item."
            )

        # Store in persistent cache
        set_cached_result(image_hash, data)
        
        return AnalysisResponse(success=True, data=analysis, error=None)

    except Exception as e:
        return AnalysisResponse(success=False, data=None, error=str(e))

@app.post("/chat")
async def chat_with_expert(request: ChatRequest):
    """
    Pediatric Expert Follow-up Chat with REAL-TIME STREAMING.
    """
    try:
        system_prompt = (
            "You are a compassionate, expert pediatric advisor for Mumzworld. "
            "You are answering follow-up questions from a parent about a product they just scanned. "
            "Use the following Safety Report context to answer their questions accurately. "
            "Respond in the same language the user is speaking (English or Arabic). "
            f"Context: {request.reportContext.json()}"
        )

        messages = [{"role": "system", "content": system_prompt}]
        for msg in request.messages:
            messages.append({"role": msg.role, "content": msg.content})

        def generate():
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=300,
                stream=True
            )
            for chunk in response:
                if chunk.choices[0].delta.content:
                    yield f"data: {chunk.choices[0].delta.content}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")

    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/health")
def health_check():
    return {"status": "healthy", "model": "gpt-4o-mini"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
