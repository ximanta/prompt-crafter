# Prompt Enhancer API

This is a FastAPI-based REST API that enhances prompts using the Gemini-pro model via LangChain.

## Setup

1. Install dependencies:
   ```pip install -r requirements.txt```

2. Run the application:
   ```uvicorn app.main:app --reload```

3. Access the API at `http://localhost:8000`

## Endpoints

- POST `/enhance_prompt`: Enhances the given prompt

## License

This project is licensed under the MIT License - see the LICENSE file for details.