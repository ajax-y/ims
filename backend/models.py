from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
import datetime

from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    role = Column(String) # 'admin', 'faculty', 'student'
    department = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    section = Column(String, nullable=True)
    
    
    attendances = relationship("Attendance", back_populates="student")
    semester_results = relationship("SemesterResult", back_populates="student")

class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String) # 'Present', 'Absent', 'Late'
    subject = Column(String, nullable=True) # Context for attendance
    latitude = Column(Float, nullable=True) # For smart attendance geo-fencing
    longitude = Column(Float, nullable=True)

    student = relationship("User", back_populates="attendances")

class Material(Base):
    __tablename__ = "materials"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    url = Column(String)
    category = Column(String) # e.g. 'ECE Semester 4'
    uploaded_by = Column(Integer, ForeignKey("users.id"))

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    message = Column(String)
    date_posted = Column(DateTime, default=datetime.datetime.utcnow)
    recipient_role = Column(String) # 'all', 'student', 'faculty'
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_read = Column(Boolean, default=False)

class CalendarEvent(Base):
    __tablename__ = "calendar_events"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime)
    event_name = Column(String)
    description = Column(String, nullable=True)
    is_holiday = Column(Boolean, default=False)

class TimetableEntry(Base):
    __tablename__ = "timetable_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(String) # e.g., 'Monday'
    class_id = Column(String)    # e.g., 'ECE-4-A'
    period_number = Column(Integer)
    subject_name = Column(String)
    faculty_id = Column(String)  # Identifier name
    room_number = Column(String, nullable=True)

class SemesterResult(Base):
    __tablename__ = "semester_results"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    semester = Column(String)
    gpa = Column(Float)
    total_credits = Column(Integer)
    
    student = relationship("User", back_populates="semester_results")
