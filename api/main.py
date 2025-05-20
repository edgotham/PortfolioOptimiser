from fastapi import FastAPI, Request
from openai import OpenAI
import os
import psycopg2

app = FastAPI()

@app.post("/query")
async def query(request: Request):
    data = await request.json()
    user_input = data.get("query")

    # Translate natural language to SQL using OpenAI
    openai_api_key = os.getenv("OPENAI_API_KEY")
    openai = OpenAI(api_key=openai_api_key)
    prompt = f"Translate the following natural language query into SQL: '{user_input}'"
    response = openai.Completion.create(engine="text-davinci-003", prompt=prompt, max_tokens=100)
    sql_query = response.choices[0].text.strip()

    # Execute SQL query against Supabase
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    conn = psycopg2.connect(supabase_url, sslmode='require')
    cursor = conn.cursor()
    cursor.execute(sql_query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return {"results": results}
