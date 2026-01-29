import requests
import json

BASE_URL = 'http://localhost:5000'
IMAGE_PATH = 'Backend/dataset/training_data/test/Common Kingfisher/ML125795771.jpg'

def run_test():
    print("🚀 Starting End-to-End Test...")
    
    import time
    email = f"test_{int(time.time())}@example.com"
    password = "password123"
    print(f"\n1. Registering user: {email}")
    
    try:
        reg_res = requests.post(f"{BASE_URL}/api/auth/register", json={
            "name": "Test User",
            "email": email,
            "password": password
        })
        print(f"   Status: {reg_res.status_code}, Response: {reg_res.json()}")
    except Exception as e:
        print(f"   FAILED to connect: {e}")
        return

    # 2. Login
    print("\n2. Logging in...")
    login_res = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": email,
        "password": password
    })
    
    if login_res.status_code != 200:
        print(f"   Login FAILED: {login_res.text}")
        return

    user_data = login_res.json()['user']
    user_id = user_data['id']
    print(f"   Login Success! User ID: {user_id}")

    # 3. Predict & Save
    print("\n3. Testing Prediction with History Saving...")
    try:
        with open(IMAGE_PATH, 'rb') as img:
            files = {'image': img}
            data = {'user_id': user_id}
            pred_res = requests.post(f"{BASE_URL}/predict", files=files, data=data)
            
        print(f"   Status: {pred_res.status_code}")
        print(f"   Prediction: {pred_res.json().get('prediction')}")
    except Exception as e:
        print(f"   Prediction FAILED: {e}")
        return

    # 4. Verify History
    print("\n4. Verifying History...")
    hist_res = requests.get(f"{BASE_URL}/api/history", params={'user_id': user_id})
    history = hist_res.json()
    print(f"   History Count: {len(history)}")
    if len(history) > 0:
        print(f"   Latest Record: {history[0]['bird_name']}")
        print("\n✅ End-to-End Test PASSED!")
    else:
        print("\n❌ History verification FAILED.")

if __name__ == "__main__":
    run_test()
