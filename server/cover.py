from groq import Groq
import os
client = Groq(
    api_key = os.getenv("GROQ_API_KEY")
)
completion = client.chat.completions.create(
    model="llama3-70b-8192",
    messages=[
        {
            "role": "system",
            "content": "from a resume and a job description create me a cover letter that is ats friendly"
        },
        {
            "role": "user",
            "content": ""
        },
        {
            "role": "assistant",
            "content": "Please provide the resume and job description, and I'll create a cover letter that is ATS-friendly.\n\n**Resume:**\n(Please paste the resume text or provide a brief summary of the candidate's work experience, skills, and achievements)\n\n**Job Description:**\n(Please paste the job description text or provide the job title, main responsibilities, and required skills)\n\nOnce I have this information, I'll create a cover letter that incorporates relevant keywords from the job description and highlights the candidate's matching skills and experiences. This will increase the chances of the cover letter passing through Applicant Tracking Systems (ATS) and catching the eye of the hiring manager."
        }
    ],
    temperature=1,
    max_tokens=1024,
    top_p=1,
    stream=False,
    stop=None,
)

print(completion.choices[0].message['content'])


