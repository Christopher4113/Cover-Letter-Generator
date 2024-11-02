from dotenv import load_dotenv
from groq import Groq
import os






# Load environment variables from .env file
load_dotenv()
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

# Initialize the Groq client
client = Groq(api_key=GROQ_API_KEY)

cover_letter_templates = []

# Prepare the messages for the chat completion
messages = [
    {
        "role": "system",
        "content": "from a resume and job description create me a cover letter"
    },
    {
        "role": "user",
        "content": "Please provide your resume and job description here."  # Update to prompt for input
    }
]

# Create the chat completion
chat_completion = client.chat.completions.create(
    messages=messages,
    model="llama3-8b-8192",
)

# Print the response content
if chat_completion.choices:
    for choice in chat_completion.choices:
        print(choice.message.content)  # Access the content directly
else:
    print("No choices returned.")