from fastapi import FastAPI, UploadFile, File, Form
import io
from typing import Annotated
app = FastAPI()

@app.get("/")
def read():
    return {"hello":"world"}

@app.post("/ask")
async def ask(
    jobDescription: Annotated[str, Form()],
    file: Annotated[UploadFile, File()]
):
    # Read the content of the uploaded file
    content = await file.read()
    
    # Here you would send `jobDescription` and `content` to your AI backend
    # result = models(jobDescription, content)
    # return {"answer": result}
    
    return {"jobDescription": jobDescription, "file_content": content.decode("utf-8")}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)