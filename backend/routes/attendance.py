from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import math

import models, schemas, database, deps

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"],
)

# Coordinates of the college (e.g., RIT Chennai approximations)
CAMPUS_LAT = 13.037891
CAMPUS_LON = 80.044909
# Allowed radius in kilometers (e.g., 500 meters)
ALLOWED_RADIUS_KM = 0.5 

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in kilometers
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat/2) * math.sin(dLat/2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dLon/2) * math.sin(dLon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = R * c
    return distance

@router.post("/mark", response_model=schemas.AttendanceResponse)
def mark_attendance(
    attendance: schemas.AttendanceCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.require_role(["student", "faculty", "admin"]))
):
    # Smart Attendance: verify student location if they are marking their own attendance
    if attendance.status == "Present" and attendance.latitude is not None and attendance.longitude is not None:
        distance = haversine_distance(CAMPUS_LAT, CAMPUS_LON, attendance.latitude, attendance.longitude)
        if distance > ALLOWED_RADIUS_KM:
            raise HTTPException(status_code=400, detail="You are not within the campus premises.")
    
    # Store the attendance record
    db_attendance = models.Attendance(
        student_id=attendance.student_id,
        status=attendance.status,
        subject=attendance.subject,
        latitude=attendance.latitude,
        longitude=attendance.longitude
    )
    db.add(db_attendance)
    
    # Create notification for the student
    notif_title = f"Attendance Marked: {attendance.status}"
    # We try to get the subject name to make it more descriptive
    subject_desc = attendance.subject if attendance.subject else "Class"
    notif_msg = f"You have been marked as {attendance.status} for {subject_desc} by {current_user.name}."
    
    db_notification = models.Notification(
        title=notif_title,
        message=notif_msg,
        recipient_role="student",
        recipient_id=attendance.student_id
    )
    db.add(db_notification)
    
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

@router.get("/", response_model=List[schemas.AttendanceResponse])
def get_attendances(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.require_role(["admin", "faculty", "student"]))
):
    if current_user.role == "student":
        # Student sees only their own attendance
        return db.query(models.Attendance).filter(models.Attendance.student_id == current_user.id).all()
    else:
        # Admin and faculty can see all attendance records
        return db.query(models.Attendance).all()
