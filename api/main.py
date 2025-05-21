from fastapi import FastAPI, Request
from openai import OpenAI
import os

app = FastAPI()

@app.post("/search")
async def search(request: Request):
    data = await request.json()
    prompt = data.get("prompt")
    if not prompt:
        return {"error": "Missing 'prompt' in request body."}

    openai_api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=openai_api_key)

    response = client.responses.create(
        model="gpt-4.1",
        tools=[{"type": "web_search_preview"}],
        input=prompt,
    )

    return {"response": response}
