from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd
import io
import math

from .. import models, schemas, database, deps, utils

router = APIRouter(
    prefix="/admin",
    tags=["Admin Excel Uploads"],
)

def handle_nan(val):
    if pd.isna(val):
        return None
    return val

@router.post("/upload/users")
async def upload_users_excel(
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.require_role(["admin"]))
):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload an Excel file.")
    
    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        
        # Expected columns: username, name, password, role, department, year, section
        added_count = 0
        for index, row in df.iterrows():
            # Check if user exists
            existing_user = db.query(models.User).filter(models.User.username == str(row['username'])).first()
            if existing_user:
                continue # Skip existing to avoid crash
            
            hashed_pwd = utils.get_password_hash(str(row['password']))
            new_user = models.User(
                username=str(row['username']),
                name=str(row['name']),
                hashed_password=hashed_pwd,
                role=str(row['role']).lower(),
                department=handle_nan(row.get('department')),
                year=handle_nan(row.get('year')),
                section=handle_nan(row.get('section'))
            )
            db.add(new_user)
            added_count += 1
            
        db.commit()
        return {"message": f"Successfully added {added_count} users."}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.post("/upload/calendar")
async def upload_calendar_excel(
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.require_role(["admin"]))
):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format.")
    
    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        
        # Expected columns: date, event_name, description, is_holiday (True/False or 1/0)
        # Clear existing calendar completely to replace with new upload
        db.query(models.CalendarEvent).delete()
        
        added_count = 0
        for index, row in df.iterrows():
            new_event = models.CalendarEvent(
                date=pd.to_datetime(row['date']),
                event_name=str(row['event_name']),
                description=handle_nan(row.get('description')),
                is_holiday=bool(row.get('is_holiday', False))
            )
            db.add(new_event)
            added_count += 1
            
        db.commit()
        return {"message": f"Successfully imported {added_count} calendar events."}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.post("/upload/timetable")
async def upload_timetable_excel(
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.require_role(["admin"]))
):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format.")
    
    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        
        # Expected columns: day_of_week, class_id, period_number, subject_name, faculty_id, room_number
        db.query(models.TimetableEntry).delete() # Replace all
        
        added_count = 0
        for index, row in df.iterrows():
            entry = models.TimetableEntry(
                day_of_week=str(row['day_of_week']),
                class_id=str(row['class_id']),
                period_number=int(row['period_number']),
                subject_name=str(row['subject_name']),
                faculty_id=str(row['faculty_id']),
                room_number=handle_nan(row.get('room_number'))
            )
            db.add(entry)
            added_count += 1
            
        db.commit()
        return {"message": f"Successfully imported {added_count} timetable entries."}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.post("/upload/results")
async def upload_semester_results(
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.require_role(["admin"]))
):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format.")
    
    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        
        # Expected columns: student_username, semester, gpa, total_credits
        added_count = 0
        for index, row in df.iterrows():
            student = db.query(models.User).filter(models.User.username == str(row['student_username'])).first()
            if not student:
                continue # Skip if student not found
                
            # Check if this exact semester result exists
            existing = db.query(models.SemesterResult).filter(
                models.SemesterResult.student_id == student.id,
                models.SemesterResult.semester == str(row['semester'])
            ).first()
            
            if existing:
                # Update existing
                existing.gpa = float(row['gpa'])
                existing.total_credits = int(row['total_credits'])
            else:
                # Add new
                new_result = models.SemesterResult(
                    student_id=student.id,
                    semester=str(row['semester']),
                    gpa=float(row['gpa']),
                    total_credits=int(row['total_credits'])
                )
                db.add(new_result)
            added_count += 1
            
        db.commit()
        return {"message": f"Successfully processed {added_count} semester results."}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.get("/calendar", response_model=list[schemas.CalendarEventResponse])
def get_calendar(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.require_role(["admin", "faculty", "student"]))
):
    return db.query(models.CalendarEvent).order_by(models.CalendarEvent.date).all()

@router.get("/timetable/{class_id}", response_model=list[schemas.TimetableEntryResponse])
def get_timetable(
    class_id: str,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.require_role(["admin", "faculty", "student"]))
):
    return db.query(models.TimetableEntry).filter(models.TimetableEntry.class_id == class_id).order_by(models.TimetableEntry.day_of_week, models.TimetableEntry.period_number).all()

@router.get("/results/me", response_model=list[schemas.SemesterResultResponse])
def get_my_results(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.require_role(["student"]))
):
    return db.query(models.SemesterResult).filter(models.SemesterResult.student_id == current_user.id).order_by(models.SemesterResult.semester).all()
