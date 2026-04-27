import os
import base64
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENAI_API_KEY")

def test_analyze_raw(image_path):
    if not os.path.exists(image_path):
        print(f"Error: {image_path} not found.")
        return

    with open(image_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    payload = {
        "model": "gpt-4o-mini",
        "messages": [
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
                    }
                ]
            }
        ],
        "response_format": {"type": "json_object"}
    }

    print("--- Sending to OpenAI via HTTP ---")
    with httpx.Client() as client:
        response = client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=60.0)
        
    if response.status_code == 200:
        result = response.json()
        print("\n--- RAW RESULTS ---")
        print(result['choices'][0]['message']['content'])
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_analyze_raw("server/test_product.png")
