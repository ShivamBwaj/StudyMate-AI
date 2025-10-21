from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os, json
from datetime import date, datetime, timedelta
from planner_agent import generate_study_plan
from google_calendar import add_to_google_calendar
from ocr_summarizer import summarize_image_slide
from pdf_summarizer import summarize_pdf
from memory_logger import save_to_memory, get_recent_memories

load_dotenv()
client = OpenAI(api_key=os.getenv("GROQ_API_KEY"), base_url="https://api.groq.com/openai/v1")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    subjects: str = None
    days_available: int = None
    hours_per_day: int = None
    history: list[dict] = []

# 🔥 Smart all-in-one endpoint
@app.post("/chat")
def smart_chat(request: ChatRequest):
    user_input = request.message.strip()

    # STEP 1: Check for memory-related queries
    memory_triggers = ["what did i study", "remind me", "last plan", "memory", "previous"]
    if any(trigger in user_input.lower() for trigger in memory_triggers):
        recent = get_recent_memories()
        if not recent:
            return {"reply": "📭 You have no saved study history yet."}
        response = "🧠 Here's your recent study memory:\n\n"
        for item in recent:
            dt = item['timestamp'].split("T")[0]
            response += f"• On {dt}, you planned {item['subjects']} for {item['days_available']} days ({item['hours_per_day']} hrs/day)\n"
        return {"reply": response}

    # STEP 2: Check if the user is *clearly* trying to create a study plan
    plan_keywords = ["study", "prepare", "revise", "syllabus", "subject", "exam"]
    if any(word in user_input.lower() for word in plan_keywords):
        planner_prompt = f"""
Extract structured information from the user's message. Only return JSON.

Required fields:
- subjects (string)
- hours_per_day (int)
- days_available (int)

Rules:
- Return ONLY the JSON object.
- Do not explain or comment anything.
- Do not wrap in markdown.
- Do not include bullet points.

If something is missing, return:
{{ "missing": ["subjects", "days_available"] }}

If everything is present:
{{ "subjects": "...", "hours_per_day": 3, "days_available": 5 }}

User: "{user_input}"
"""
        try:
            result_text = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": planner_prompt}],
            ).choices[0].message.content

            result = json.loads(result_text)

            if "missing" in result:
                parts = {
                    "subjects": "what subjects",
                    "hours_per_day": "how many hours/day",
                    "days_available": "how many days"
                }
                ask = "Can you please tell me " + ", ".join([parts[m] for m in result["missing"]]) + "?"
                return {"reply": ask}

            # Generate study plan
            plan = generate_study_plan(result["subjects"], result["hours_per_day"], result["days_available"])
            due = date.today() + timedelta(days=result['days_available'])

            save_to_memory(result["subjects"], result["hours_per_day"], result["days_available"])

            reply = (
                f"📚 Here's your personalized plan for {result['subjects']}:\n\n{plan}"
                f"\n\n✅ I’ve logged this as a task due by {due}."
                f"\n📅 Would you like me to add this plan to your Google Calendar?"
            )

            return {
                "reply": reply,
                "subjects": result["subjects"],
                "days_available": result["days_available"],
                "hours_per_day": result["hours_per_day"]
            }

        except Exception as planner_fail:
            print("⚠️ Planner failed, falling back to Q&A:", planner_fail)

    # STEP 3: Fallback — General Q&A like ChatGPT
    try:
        chat_messages = request.history + [
            {"role": "user", "content": request.message}
        ]
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=chat_messages,
            temperature=0.5
        )

        return {"reply": response.choices[0].message.content}
    except Exception as e:
        print("❌ Fallback error:", e)
        return {"reply": "❌ Sorry, I couldn’t answer that."}


# ✅ PDF summarizer
@app.post("/chat-pdf")
async def chat_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(contents)

    try:
        summary = summarize_pdf(temp_path)
        reply = f"📄 Summary of your PDF:\n\n{summary}"
    except Exception as e:
        print("❌ PDF error:", e)
        reply = "❌ Couldn’t process the PDF."
    finally:
        os.remove(temp_path)

    return {"reply": reply}


# ✅ Image OCR summarizer
@app.post("/chat-ocr")
async def chat_ocr(file: UploadFile = File(...)):
    """
    Accepts an uploaded image file (.png/.jpg/.jpeg) and returns OCR summary.
    """
    if not file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
        return {"reply": "❌ Please upload a PNG or JPG image."}

    contents = await file.read()
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(contents)

    try:
        summary = summarize_image_slide(temp_path)
        reply = f"📝 OCR Summary of your image:\n\n{summary}"
    except Exception as e:
        print("❌ OCR summarization error:", e)
        reply = "❌ Sorry, I couldn't process the image."
    finally:
        os.remove(temp_path)

    return {"reply": reply}
