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
class CoverLetterSection(BaseModel):
    filename: str
    header: str
    introduction: str
    skills_and_achievements: str
    conclusion: str

@app.post("/generate_cover_letters", response_model=List[CoverLetterSection])
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

    # Prepare list for storing generated cover letter sections
    generated_cover_letters = []
    
    for template in cover_letter_templates:
        try:
            # 1. Generate Header Section
            messages_header = [
                {"role": "system", "content": "Provide only the requested information for a header for a cover letter with the applicant's name, location, phone, email, and todays date. Avoid any additional text or introductory phrases."},
                {"role": "user", "content": f"Template: {template['content']}\nResume: {resume_content}\nJob Description: {jobDescription}\n date: {today}\n company: {company}\nJob Location: {location}"}
            ]
            header_completion = client.chat.completions.create(messages=messages_header, model="llama3-8b-8192")
            header_content = header_completion.choices[0].message.content if header_completion.choices else "Header generation failed"

            # 2. Generate Introduction Paragraph
            messages_intro = [
                {"role": "system", "content": "Provide only the requested information for an introduction paragraph expressing enthusiasm for the role and mentioning relevant educational background (3 sentences). Avoid any additional text or introductory phrases."},
                {"role": "user", "content": f"Template: {template['content']}\nResume: {resume_content}\nJob Description: {jobDescription}\n date: {today}\n company: {company}\nJob Location: {location}"}
            ]
            intro_completion = client.chat.completions.create(messages=messages_intro, model="llama3-8b-8192")
            intro_content = intro_completion.choices[0].message.content if intro_completion.choices else "Introduction generation failed"

            # 3. Generate Skills and Achievements Paragraph
            messages_skills = [
                {"role": "system", "content": "Provide only the requested information for a paragraph describing the applicant's skills and achievements that align with the job description (3 sentences). Avoid any additional text or introductory phrases."},
                {"role": "user", "content": f"Template: {template['content']}\nResume: {resume_content}\nJob Description: {jobDescription}\n date: {today}\n company: {company}\nJob Location: {location}"}
            ]
            skills_completion = client.chat.completions.create(messages=messages_skills, model="llama3-8b-8192")
            skills_content = skills_completion.choices[0].message.content if skills_completion.choices else "Skills paragraph generation failed"

            # 4. Generate Conclusion Paragraph
            messages_conclusion = [
                {"role": "system", "content": "Provide only the requested information for a closing paragraph expressing interest in the position and inviting the hiring manager without saying Dear Hiring Manager to reach out. Avoid any additional text or introductory phrases."},
                {"role": "user", "content": f"Template: {template['content']}\nResume: {resume_content}\nJob Description: {jobDescription}\n date: {today}\n company: {company}\nJob Location: {location}"}
            ]
            conclusion_completion = client.chat.completions.create(messages=messages_conclusion, model="llama3-8b-8192")
            conclusion_content = conclusion_completion.choices[0].message.content if conclusion_completion.choices else "Conclusion generation failed"

            # Store each section in JSON format
            generated_cover_letter = {
                "filename": template["filename"],
                "header": header_content,
                "introduction": intro_content,
                "skills_and_achievements": skills_content,
                "conclusion": conclusion_content
            }

            generated_cover_letters.append(generated_cover_letter)

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating cover letter: {e}")

    return generated_cover_letters

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
