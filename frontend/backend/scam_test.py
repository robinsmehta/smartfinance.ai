import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ.get("NEXALARIS_API_KEY")
endpoint = os.environ.get("NEXALARIS_OPENAI_ENDPOINT")

url = f"{endpoint.rstrip('/')}/openai/deployments/gpt-5.4/chat/completions?api-version=2024-02-15-preview"
headers = {"Content-Type": "application/json", "api-key": api_key}

payload = {
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe this image in one word."},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" 
                    }
                }
            ]
        }
    ],
    "max_completion_tokens": 10
}
resp = requests.post(url, headers=headers, json=payload)
print("GPT-5.4 Vision Test:", resp.status_code, resp.text)

url2 = f"{endpoint.rstrip('/')}/openai/deployments/gpt-image-1.5/chat/completions?api-version=2024-02-15-preview"
resp2 = requests.post(url2, headers=headers, json=payload)
print("GPT-image-1.5 Vision Test:", resp2.status_code, resp2.text)
