from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routes import auth, attendance, materials, notifications, admin

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="IMS Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(attendance.router)
app.include_router(materials.router)
app.include_router(notifications.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to IMS Backend API!"}
