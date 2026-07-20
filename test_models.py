import os
import requests

api_key = os.environ.get("GEMINI_API_KEY", "AIzaSyBl4YZd85JAzvEf7lSDRNMiuSOhDQitfyQ")
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
response = requests.get(url)
print(response.json())
