import os
from openai import OpenAI
from dotenv import load_dotenv
from PyPDF2 import PdfReader

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"  
)

def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text() or ""
    return full_text.strip()

def summarize_pdf(pdf_path):
    print(f"📄 Reading PDF: {pdf_path}")
    content = extract_text_from_pdf(pdf_path)

    if not content:
        return "❌ No text found in PDF."

    
    if len(content) > 10000:
        content = content[:10000]  

    print("🧠 Summarizing...")


    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {
                "role": "system",
                "content": "You're a helpful study assistant. Summarize the uploaded PDF clearly and concisely in points."
            },
            {
                "role": "user",
                "content": content
            }
        ],
        temperature=0.3  
    )

    return response.choices[0].message.content
