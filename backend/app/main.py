from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.prompt_enhancer import enhance_prompt, enhance_prompt_stream
from fastapi import WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse



app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

class PromptRequest(BaseModel):
    prompt: str

class PromptResponse(BaseModel):
    enhanced_prompt: str

@app.post("/enhance_prompt", response_model=PromptResponse)
async def enhance_prompt_endpoint(request: PromptRequest):
    result = enhance_prompt(request.prompt)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return {"enhanced_prompt": result["enhanced_prompt"]}

@app.post("/enhance_prompt_stream")
async def enhance_prompt_stream_endpoint(request: PromptRequest):
    return StreamingResponse(enhance_prompt_stream(request.prompt), media_type="application/json")

@app.websocket("/ws/enhance_prompt")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            user_prompt = await websocket.receive_text()
            async for chunk in enhance_prompt_stream(user_prompt):
                await websocket.send_text(chunk)
            await websocket.send_text("[DONE]")
        except WebSocketDisconnect:
            print("Client disconnected")
            break
        except Exception as e:
            print(f"Error in WebSocket: {str(e)}")
            await websocket.close(code=1000)
            break

@app.get("/test_stream", response_class=HTMLResponse)
async def test_stream(request: Request):
    return """
    <html>
        <body>
            <h1>Test Streaming</h1>
            <form id="promptForm">
                <input type="text" id="promptInput" placeholder="Enter your prompt">
                <button type="submit">Enhance Prompt</button>
            </form>
            <pre id="result"></pre>

            <script>
                const form = document.getElementById('promptForm');
                const resultPre = document.getElementById('result');

                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const prompt = document.getElementById('promptInput').value;
                    resultPre.textContent = 'Loading...';

                    const response = await fetch('/enhance_prompt_stream', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ prompt: prompt }),
                    });

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    resultPre.textContent = '';

                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value);
                        resultPre.textContent += chunk;
                    }
                });
            </script>
        </body>
    </html>
    """

