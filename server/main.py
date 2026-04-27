import os
import base64
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import json
from schemas import AnalysisResponse, SafetyReport

# Load environment variables
load_dotenv()

app = FastAPI(title="Mumz-Shield API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def encode_image(image_bytes):
    return base64.b64encode(image_bytes).decode('utf-8')

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_product(file: UploadFile = File(...)):
    print(f"📥 Received analysis request for: {file.filename}")
    try:
        # Read image
        contents = await file.read()
        base64_image = encode_image(contents)

        # AI Call with JSON Mode (Pydantic v1 Compatible)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a Mumzworld Safety Expert. Analyze product images "
                        "and provide a structured safety audit in JSON format. "
                        "Scope: ALL baby products including Food, Formula, Skin-care (Lotion/Cream), Hygiene (Shampoo/Diaper), and Medicine. "
                        "If the image is one of these, set is_in_scope to true. "
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

        raw_content = response.choices[0].message.content
        data = json.loads(raw_content)
        
        # Manual validation using Pydantic v1
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
