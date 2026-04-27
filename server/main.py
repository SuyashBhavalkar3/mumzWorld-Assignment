# ==========================================
# MUMZ-SHIELD AI BACKEND (FastAPI)
# ==========================================
# This server handles image processing and AI safety audits.
# It uses OpenAI's Vision models to analyze product labels.

import os
import base64
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import json
from schemas import AnalysisResponse, SafetyReport

# Load environment variables (like OPENAI_API_KEY) from .env file
load_dotenv()

app = FastAPI(title="Mumz-Shield Safety API")

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
        # Step 1: Process the image file
        contents = await file.read()
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
        analysis = SafetyReport(**data)
        
        if not analysis.is_in_scope:
            return AnalysisResponse(
                success=True, 
                data=None, 
                error="This product is outside our safety audit scope. Please upload a baby-related consumable or skin-care item."
            )

        return AnalysisResponse(success=True, data=analysis, error=None)

    except Exception as e:
        return AnalysisResponse(success=False, data=None, error=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy", "model": "gpt-4o-mini"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
