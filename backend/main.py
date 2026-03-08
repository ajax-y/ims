from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routes import auth, attendance, materials, notifications, admin

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="IMS Backend API")

from database import SessionLocal
from utils import get_password_hash

@app.on_event("startup")
def seed_default_users():
    db = SessionLocal()
    try:
        user_count = db.query(models.User).count()
        if user_count == 0:
            print("Database is empty. Seeding default users...")
            default_users = [
                {"username": "aden", "password": "12345", "name": "Aden Admin", "role": "admin"},
                {"username": "ajay", "password": "12345", "name": "Ajay", "role": "faculty"},
                {"username": "aldrin", "password": "12345", "name": "Aldrin", "role": "student", "department": "B.E.ECE/01/A"},
                {"username": "kaviya", "password": "12345", "name": "Kaviya", "role": "student", "department": "B.E.CSE/02/B"}
            ]
            for u in default_users:
                hashed_pw = get_password_hash(u["password"])
                db_user = models.User(
                    username=u["username"],
                    name=u["name"],
                    hashed_password=hashed_pw,
                    role=u["role"],
                    department=u.get("department")
                )
                db.add(db_user)
            db.commit()
            print("Default users seeded successfully.")
    except Exception as e:
        print(f"Error seeding default users: {e}")
    finally:
        db.close()
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
