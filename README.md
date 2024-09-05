# Prompt Crafter

Prompt Crafter is a web application that helps users enhance their prompts for large language models. It consists of a FastAPI backend and a Next.js frontend.

## Project Structure

- `backend/`: FastAPI backend
- `prompt-crafter/`: Next.js frontend

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- Gemini API key

## Setup and Running

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Set up your Gemini API key:
   - Create a file named `.env` in the `backend` directory
   - Add your Gemini API key to the `.env` file:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```
   - Replace `your_actual_api_key_here` with your actual Gemini API key

6. Run the FastAPI server:
   ```
   uvicorn app.main:app --reload
   ```

The backend will be available at `http://localhost:8000`.

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Run the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

The frontend will be available at `http://localhost:3000`.

## Usage

1. Open your browser and go to `http://localhost:3000`.
2. Enter a prompt in the left panel.
3. Click the "Enhance" button to generate enhanced prompts.
4. View the enhanced prompts in the middle panel.
5. Send an enhanced prompt to the assistant in the right panel to see a simulated response.

## Obtaining a Gemini API Key

To use this application, you need a Gemini API key. Here's how to get one:

1. Go to the [Google AI Studio](https://makersuite.google.com/app/apikey).
2. Sign in with your Google account or create one if you don't have it.
3. Once logged in, you should see an option to create an API key.
4. Copy the generated API key and use it in the backend setup as described above.

Note: Keep your API key confidential and never share it publicly.

## License

This project is licensed under the MIT License. See the LICENSE file for details.