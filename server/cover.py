from dotenv import load_dotenv
from groq import Groq
import os
import fitz  # PyMuPDF








# Load environment variables from .env file
load_dotenv()
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

# Initialize the Groq client
client = Groq(api_key=GROQ_API_KEY)

cover_letter_templates = []
# Directory containing the PDF templates
templates_dir = "templates"
for filename in os.listdir(templates_dir):
    if filename.endswith(".pdf"):
        filepath = os.path.join(templates_dir, filename)
        pdf_content = ""

        # Open the PDF and extract text
        with fitz.open(filepath) as pdf:
            for page_num in range(pdf.page_count):
                page = pdf[page_num]
                pdf_content += page.get_text()  # Extract text from each page

        cover_letter_templates.append({"filename": filename, "content": pdf_content})


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