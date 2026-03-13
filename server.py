from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent.core import Agent
import uvicorn
import logging
from utils.file_parser import docxParser, pdfParser


app = FastAPI(title="AI Agent API")

# Configure CORS so the frontend can communicate with the server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the agent
try:
    agent = Agent()
    logging.info("Agent initialized successfully.")
except Exception as e:
    logging.error(f"Failed to initialize agent: {e}")
    agent = None

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.post("/chat", response_model=ChatResponse)
async def chat(request_Message: str = Form(...),
    request_file: Optional[UploadFile] = File(None)
    ):
    if not agent:
        raise HTTPException(status_code=500, detail="Agent not initialized")
    formatted_user_input = f"""
        <user_input>
        {request_Message}
        </user_input>
        """
    try:
        context = ""
        if request_file:
            print(f"file provided: {request_file.filename}")
            file_content = await request_file.read()
            
            if request_file.filename.endswith(".txt"):
                context = file_content.decode("utf-8")
            elif request_file.filename.endswith(".docx"):
                # Just call the function directly
                context = docxParser(file_content)
            elif request_file.filename.endswith(".pdf"):
                context = pdfParser(file_content)

            # Corrected the newline/formatting
            message = f"<user_input> User Message: {request_Message}\n\nDocument Context: {context} </user_input>"
        else:
            message = formatted_user_input
        
        result = agent.run(message)
        return ChatResponse(response=result)
    except Exception as e:
        logging.error(f"Error during agent execution: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "agent_loaded": agent is not None}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
