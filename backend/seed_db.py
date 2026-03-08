import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
import models
from utils import get_password_hash

def seed_users():
    db = SessionLocal()
    try:
        models.Base.metadata.create_all(bind=engine)
        
        default_users = [
            {"username": "aden", "password": "12345", "name": "Aden Admin", "role": "admin"},
            {"username": "ajay", "password": "12345", "name": "Ajay", "role": "faculty"},
            {"username": "aldrin", "password": "12345", "name": "Aldrin", "role": "student", "department": "B.E.ECE/01/A"},
            {"username": "kaviya", "password": "12345", "name": "Kaviya", "role": "student", "department": "B.E.CSE/02/B"}
        ]
        
        for u in default_users:
            existing = db.query(models.User).filter(models.User.username == u["username"]).first()
            if not existing:
                print(f"Adding user {u['username']}...")
                hashed_pw = get_password_hash(u["password"])
                db_user = models.User(
                    username=u["username"],
                    name=u["name"],
                    hashed_password=hashed_pw,
                    role=u["role"],
                    department=u.get("department")
                )
                db.add(db_user)
            else:
                print(f"User {u['username']} already exists, updating password.")
                existing.hashed_password = get_password_hash(u["password"])
                db.add(existing)
        
        db.commit()
        print("Done seeding users.")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
