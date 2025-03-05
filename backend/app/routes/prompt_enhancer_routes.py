from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse
from pydantic import BaseModel
from app.services.prompt_enhancer_service import enhance_prompt, enhance_prompt_stream, answer

router = APIRouter()

class PromptRequest(BaseModel):
    prompt: str

class PromptResponse(BaseModel):
    enhanced_prompt: str

@router.get("/health")
def health_check():
    return {"status": "healthy"}

@router.post("/enhance_prompt", response_model=PromptResponse)
async def enhance_prompt_endpoint(request: PromptRequest):
    result = enhance_prompt(request.prompt)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return {"enhanced_prompt": result["enhanced_prompt"]}

@router.post("/enhance_prompt_stream")
async def enhance_prompt_stream_endpoint(request: PromptRequest):
    return StreamingResponse(enhance_prompt_stream(request.prompt), media_type="application/json")

@router.post("/answer")
async def answer_endpoint(request: PromptRequest):
    return StreamingResponse(answer(request.prompt), media_type="application/json")

