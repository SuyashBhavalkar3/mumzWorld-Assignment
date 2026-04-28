from pydantic import BaseModel, Field
from typing import List, Optional

class Ingredient(BaseModel):
    name_en: str
    name_ar: str
    safety_rating: str = Field(description="One of: Safe, Caution, Avoid")
    reason_en: str
    reason_ar: str

class Recommendation(BaseModel):
    name: str
    brand: str
    image_url: str
    product_url: str
    price: str
    reason: str

class SafetyReport(BaseModel):
    product_name_en: Optional[str]
    product_name_ar: Optional[str]
    safety_score: int = Field(ge=0, le=10, description="Overall safety score out of 10")
    risk_level: str = Field(description="Low, Medium, High")
    ingredients: List[Ingredient]
    summary_en: str
    summary_ar: str
    trust_badges: List[str] = Field(description="e.g., 'Paraben-Free', 'Halal', 'Dermatologically Tested'")
    is_in_scope: bool = Field(description="True if it's a baby-related product (food, skin-care, etc.), False otherwise")
    confidence_score: float = Field(ge=0, le=1, description="AI confidence in the extraction")
    recommendations: List[Recommendation] = []

class AnalysisResponse(BaseModel):
    success: bool
    data: Optional[SafetyReport]
    error: Optional[str]

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    reportContext: SafetyReport
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    success: bool
    reply: Optional[str]
    error: Optional[str]
