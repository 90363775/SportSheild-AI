from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from api import router

# Initialize the SQLite database
init_db()

app = FastAPI(
    title="SportShield AI Backend",
    description="Backend for media hashing, similarity detection, risk scoring, and AI explanation.",
    version="1.0.0"
)

# Allow CORS so the Vite frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API routes
app.include_router(router.router, prefix="/api", tags=["Media Analysis"])

@app.get("/")
def read_root():
    return {"status": "SportShield AI Backend is running."}

if __name__ == "__main__":
    import uvicorn
    # Make sure we run on a different port than Vite
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
