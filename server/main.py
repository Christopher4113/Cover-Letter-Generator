from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from typing import List
from pydantic import BaseModel
import os
import fitz  # PyMuPDF
from dotenv import load_dotenv
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

# Initialize the Groq client
client = Groq(api_key=GROQ_API_KEY)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update to match the origin of your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Load the cover letter templates
cover_letter_templates = []
templates_dir = "templates"
for filename in os.listdir(templates_dir):
    if filename.endswith(".pdf"):
        filepath = os.path.join(templates_dir, filename)
        pdf_content = ""
        with fitz.open(filepath) as pdf:
            for page_num in range(pdf.page_count):
                page = pdf[page_num]
                pdf_content += page.get_text()
        cover_letter_templates.append({"filename": filename, "content": pdf_content})


# Pydantic model for response
class CoverLetter(BaseModel):
    filename: str
    content: str


@app.post("/generate_cover_letters", response_model=List[CoverLetter])
async def generate_cover_letters(
    resume: UploadFile = File(...),  # Accept file using File()
    jobDescription: str = Form(...),
    today: str = Form(...),
    company: str = Form(...),
    location: str = Form(...)
):
    
    # Check if the file is a PDF
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDFs are allowed.")

    # Read the PDF content
    resume_content = ""
    try:
        with fitz.open(stream=await resume.read(), filetype="pdf") as pdf:
            for page in pdf:
                resume_content += page.get_text()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {e}")

    # Prepare list for storing generated cover letters
    generated_cover_letters = []
    for template in cover_letter_templates:
        messages = [
            {"role": "system", "content": "from a resume and job description, date, company and job location, create a one page cover letter and follow the following templates to create a personalize cover letter. Use only the information you can find from the resume/job description/company/date/job location to do so "},
            {"role": "user", "content": f"Template: {template['content']}\nResume: {resume_content}\nJob Description: {jobDescription}\n date: {today}\n company: {company}\nJob Location: {location}"}
        ]
        
        # Create chat completion
        try:
            chat_completion = client.chat.completions.create(
                messages=messages,
                model="llama3-8b-8192",
            )

            if chat_completion.choices:
                generated_content = chat_completion.choices[0].message.content
                generated_cover_letters.append({
                    "filename": template["filename"],
                    "content": generated_content
                })
            else:
                raise HTTPException(status_code=500, detail="No choices returned from AI model.")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating cover letter: {e}")

    print(generate_cover_letters)
    return generated_cover_letters

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
