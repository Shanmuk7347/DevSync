from google.genai import types
from .google_client import google_genai_client, MODEL


def generate_json(
    prompt: str,
    system_instruction: str = None,
    model: str = MODEL,
    response_schema=None
):
    client = google_genai_client()

    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        response_mime_type="application/json",
        response_schema=response_schema
    )

    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=config
    )

    return response.text
