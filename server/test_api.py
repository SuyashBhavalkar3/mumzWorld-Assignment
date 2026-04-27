import requests
import os
import sys

# Force UTF-8 for Windows Terminal
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

def test_backend_api(image_path):
    url = "http://127.0.0.1:8000/analyze"
    
    if not os.path.exists(image_path):
        print(f"Error: {image_path} not found.")
        return

    print(f"--- Sending {image_path} to API ---")
    with open(image_path, "rb") as f:
        files = {"file": f}
        response = requests.post(url, files=files)

    if response.status_code == 200:
        print("\n--- API SUCCESS ---")
        data = response.json()
        if data["success"] and data["data"]:
            print("Product Identification Successful!")
            report = data["data"]
            print(f"EN: {report['product_name_en']}")
            print(f"AR: {report['product_name_ar']}")
            print(f"Safety Score: {report['safety_score']}/10")
            print(f"Risk Level: {report['risk_level']}")
            print(f"\nSummary (AR): {report['summary_ar']}")
        else:
            print(f"Server Message: {data.get('error', 'No error message provided')}")
            print(f"Raw Data: {data.get('data')}")
    else:
        print(f"HTTP Error {response.status_code}: {response.text}")

if __name__ == "__main__":
    test_backend_api("server/test_product.png")
