from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.prompt_enhancer_routes import router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router
app.include_router(router, prefix="/api/v1", tags=["prompt_enhancer"])

