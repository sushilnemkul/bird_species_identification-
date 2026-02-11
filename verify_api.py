import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_api():
    print("--- Verifying API Endpoints ---")
    
    # 1. Health check
    try:
        r = requests.get(f"{BASE_URL}/health")
        print(f"Health Check: {r.status_code} {r.json()}")
    except Exception as e:
        print(f"Health Check Failed: {e}")

    # 2. Explore Page (Get Birds)
    try:
        r = requests.get(f"{BASE_URL}/api/birds")
        if r.status_code == 200:
            birds = r.json()
            print(f"Get Birds: {r.status_code} (Found {len(birds)} birds)")
            if birds:
                print(f"Sample Bird: {birds[0]['commonName']}")
        else:
            print(f"Get Birds Failed: {r.status_code}")
    except Exception as e:
        print(f"Get Birds Exception: {e}")

    # 3. History (Check schema is queryable)
    try:
        # Using user_id=1 as a test
        r = requests.get(f"{BASE_URL}/api/history", params={"user_id": 1})
        if r.status_code == 200:
            history = r.json()
            print(f"Get History: {r.status_code} (Found {history['total']} items)")
            if history['items']:
                item = history['items'][0]
                print(f"Sample History Item: {item['bird_name']} at {item['timestamp']}")
                print(f"Details present: {'details' in item}")
        else:
            print(f"Get History Failed: {r.status_code}")
    except Exception as e:
        print(f"Get History Exception: {e}")

    # 4. Auth (Simple register check - optional as we don't want to spam)
    # 5. Predict (Requires image, skipping automated binary post for now, seen work in logs)

if __name__ == "__main__":
    test_api()
