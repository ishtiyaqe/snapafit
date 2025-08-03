import requests

def get_first_image_url(query, token):
    url = "https://api.pexels.com/v1/search"
    headers = {
        "Authorization": token
    }
    params = {
        "query": query,
        "per_page": 1
    }
    
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        response_data = response.json()
        if response_data.get('photos'):
            return response_data['photos'][0]['src']['original']  # Get the URL of the original image
        else:
            print("No images found.")
            return None
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

# Replace with your Pexels API key
API_KEY = "CJg8u7m8TTKv4jwF1oZlxptTe9TpYEIUuCpVAFrICMAEzdKHfM7W8aVy"

# Example usage
image_url = get_first_image_url("Oatmeal with Berries", API_KEY)
print(image_url)

