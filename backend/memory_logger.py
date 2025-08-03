import json
import os
from datetime import datetime

MEMORY_FILE = "study_memory.json"

def save_to_memory(subjects, hours, days):
    data = {
        "subjects": subjects,
        "hours_per_day": hours,
        "days_available": days,
        "timestamp": datetime.now().isoformat()
    }

    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "r") as f:
            memory = json.load(f)
    else:
        memory = []

    memory.append(data)

    with open(MEMORY_FILE, "w") as f:
        json.dump(memory, f, indent=2)

def get_recent_memories(n=3):
    if not os.path.exists(MEMORY_FILE):
        return []

    with open(MEMORY_FILE, "r") as f:
        memory = json.load(f)

    return memory[-n:]
