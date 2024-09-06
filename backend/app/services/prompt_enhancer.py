import json
import re
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.responses import StreamingResponse
import asyncio
import logging
# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

# Load the API key from the environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set. Please check your .env file.")

app = FastAPI()

# Define the template at the global scope
PROMPT_TEMPLATE = """
Act as 3 Prompt Engineers who are expert in enhancing prompt to get the best out of a large language model I will give a sample prompt and each of the prompt engineer needs to:

1. Critically analyze the prompt and list down your feedbacks, focus on the aspects of writing a good prompt that are missing.
2. List down the prompt engineering techniques that can be applied to enhance the prompt. Outline the approach and though process.
3. Apply the techniques and enhance the prompt.

Share each step with the group and critique each other's responses.
Rate the responses on a scale from 1 to 5, with 1 indicating a highly unlikely approach and 5 indicating a highly likely approach.
If any expert's idea is judged to be fundamentally flawed or is deemed invalid at any step, remove them from the discussion.

It is very important that you only return the enhanced prompt and not respond to the prompt. 
Some examples are given below.

<example>
prompt:"What is Java?"
enhanced_prompt:"Explain what Java is, covering the following aspects:
A general overview of Java as a programming language.
Key features that differentiate Java from other programming languages.
Common use cases and applications of Java in the tech industry.
Historical context and development of Java."
</example>

<example>
prompt:"Tell me a story of a Robot"
enhanced_prompt:"Tell me a captivating story featuring a robot. The story should include the following elements:
The Robot’s background—how it was created and its primary purpose.
The Robot discovering a new ability or feature that sets it apart.
A conflict or challenge that the Robot faces and has to overcome.
Interactions with human or robotic characters that influence its journey.
A resolution that highlights the Robot’s growth or the impact it has on its world."
</example>
Respond in the below JSON format.

{{"enhanced_prompt": "This is the enhanced prompt"}}
Do not include any observations and analysis in your response. ONLY PROVIDE THE JSON.

###
The prompt is {user_prompt}

"""


import json
from fastapi.responses import StreamingResponse
async def enhance_prompt_stream(user_prompt: str):
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GEMINI_API_KEY, streaming=True)

        prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        messages = prompt.format_messages(user_prompt=user_prompt)
        messages_dicts = [{"role": "user", "content": m.content} for m in messages]

        async for chunk in llm.astream(messages_dicts):
            # Clean the chunk to avoid double-wrapped JSON
            cleaned_content = chunk.content.strip()
            
            # Handle responses wrapped in backticks
            if cleaned_content.startswith("```") and cleaned_content.endswith("```"):
                cleaned_content = cleaned_content[3:-3].strip()

            # Try to parse the cleaned content as JSON
            try:
                json_response = json.loads(cleaned_content)
                # Yield just the enhanced prompt field
                yield json_response.get("enhanced_prompt", cleaned_content)
            except json.JSONDecodeError:
                # If JSON parsing fails, extract the enhanced prompt using regex
                match = re.search(r'"enhanced_prompt"\s*:\s*"(.+?)"', cleaned_content, re.DOTALL)
                if match:
                    enhanced_prompt = match.group(1).replace('\\n', '\n').strip()
                    yield enhanced_prompt
                else:
                    # If extraction fails, yield raw content
                    yield cleaned_content

        # Send a final message to indicate the end of the stream
        yield "[DONE]"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in streaming: {str(e)}")

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


async def answer(user_prompt: str):
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GEMINI_API_KEY, streaming=True)
        
        async for chunk in llm.astream([{"role": "user", "content": user_prompt}]):
            # Log the response chunk
            logger.info(f"Gemini response chunk: {chunk.content}")
            yield chunk.content
        
        # Send a final message to indicate the end of the stream
        yield "[DONE]"
    except Exception as e:
        logger.error(f"Error in streaming: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error in streaming: {str(e)}")

def enhance_prompt(user_prompt: str) -> dict:
    llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GEMINI_API_KEY)

    prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    messages = prompt.format_messages(user_prompt=user_prompt)
    messages_dicts = [{"role": "user", "content": m.content} for m in messages]

    response = llm.invoke(messages_dicts)
    print("Raw response:", response.content)

    # Clean the response content
    cleaned_content = response.content.strip()
    if cleaned_content.startswith("```") and cleaned_content.endswith("```"):
        cleaned_content = cleaned_content[3:-3].strip()

    try:
        # Try to parse the cleaned response as JSON
        json_response = json.loads(cleaned_content)
        return json_response
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        # If JSON parsing fails, try to extract the enhanced prompt directly
        match = re.search(r'"enhanced_prompt"\s*:\s*"(.+?)"', cleaned_content, re.DOTALL)
        if match:
            enhanced_prompt = match.group(1).replace('\\n', '\n').strip()
            return {"enhanced_prompt": enhanced_prompt}
        else:
            # If extraction fails, return the raw content
            return {"error": "Failed to parse response", "raw_content": cleaned_content}