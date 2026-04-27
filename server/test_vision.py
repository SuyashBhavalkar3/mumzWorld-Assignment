import os
import base64
from openai import OpenAI
from dotenv import load_dotenv
# from schemas import SafetyReport

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def test_analyze(image_path):
    if not os.path.exists(image_path):
        print(f"Error: {image_path} not found.")
        return

    with open(image_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')

    print("--- Sending to AI ---")
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a Mumzworld Safety Expert. Extract ingredients and provide a safety audit in JSON."
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Analyze this product label. Return JSON with product_name, ingredients (list), and safety_score."},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                    },
                ],
            }
        ],
        response_format={"type": "json_object"}
    )

    print("\n--- RAW RESULTS ---")
    print(response.choices[0].message.content)

if __name__ == "__main__":
    # You can put a test image path here later
    test_analyze("server/test_product.png")
    print("Test script ready. Update the image path in test_vision.py to run.")
