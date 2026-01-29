import requests

url = 'http://localhost:5000/predict'
image_path = 'Backend/dataset/training_data/test/Common Kingfisher/ML125795771.jpg'

try:
    with open(image_path, 'rb') as img:
        files = {'image': img}
        response = requests.post(url, files=files)
    
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(response.json())
except Exception as e:
    print(f"Error: {e}")
app.pyplot