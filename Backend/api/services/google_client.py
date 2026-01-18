import os
from google import genai

MODEL = "gemini-2.5-flash"

def google_genai_client():
    client = genai.Client(
        api_key=os.getenv("GEMINI_API_KEY")
    )


    return client