from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

# Load API key from environment
api_key = os.getenv("GROQ_API_KEY")

# Create the Groq-compatible OpenAI client
client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
)

def generate_study_plan(subjects, hours_per_day, days_available):
    prompt = f"""
You are a helpful and responsible study planner AI.
Create a detailed daily study schedule for the following subjects: {subjects}.
The student has {hours_per_day} hours per day and wants to study for {days_available} days.

Make sure to:
- Prioritize all subjects equally
- Include short breaks
- Give daily time blocks
- Motivate the user at the end
-return me readable text with line breaks like:-
📅 Day 1:
- 30 mins: Review notes
- 45 mins: Practice problems
...

Give the schedule as a list day-by-day.
    """

    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
    )

    return response.choices[0].message.content
