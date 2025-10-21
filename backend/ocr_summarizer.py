
import os
import pytesseract
from PIL import Image
import cv2
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"  

client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
)

def extract_text_from_image(image_path):
    """Reads image and extracts text using OCR."""
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(gray)
    return text.strip()

def summarize_image_slide(image_path):
    """Extracts text from image and summarizes it."""
    text = extract_text_from_image(image_path)

    if not text:
        return "❌ No readable text detected in the image."

    if len(text) > 10000:
        text = text[:10000]

    print("🧠 Summarizing extracted text...")

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are an AI assistant summarizing lecture content from an image."},
            {"role": "user", "content": text}
        ],
        temperature=0.5,
    )

    return response.choices[0].message.content
