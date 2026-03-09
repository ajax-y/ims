from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# USER schemas
class UserBase(BaseModel):
    username: str
    name: str
    role: str
    department: Optional[str] = None
    year: Optional[int] = None
    section: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

# ATTENDANCE schemas
class AttendanceBase(BaseModel):
    status: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class AttendanceCreate(AttendanceBase):
    student_id: int
    subject: Optional[str] = None

class AttendanceResponse(AttendanceBase):
    id: int
    student_id: int
    date: datetime

    class Config:
        from_attributes = True

# MATERIAL schemas
class MaterialBase(BaseModel):
    title: str
    description: Optional[str] = None
    url: str
    category: str

class MaterialCreate(MaterialBase):
    pass

class MaterialResponse(MaterialBase):
    id: int
    uploaded_by: int

    class Config:
        from_attributes = True

# NOTIFICATION schemas
class NotificationBase(BaseModel):
    title: str
    message: str
    recipient_role: str
    recipient_id: Optional[int] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    id: int
    date_posted: datetime
    is_read: bool

    class Config:
        from_attributes = True

# JWT Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# NEW SCHEMAS FOR PHASE 7

# CALENDAR schemas
class CalendarEventBase(BaseModel):
    date: datetime
    event_name: str
    description: Optional[str] = None
    is_holiday: bool = False

class CalendarEventResponse(CalendarEventBase):
    id: int
    class Config:
        from_attributes = True

# TIMETABLE schemas
class TimetableEntryBase(BaseModel):
    day_of_week: str
    class_id: str
    period_number: int
    subject_name: str
    faculty_id: str
    room_number: Optional[str] = None

class TimetableEntryResponse(TimetableEntryBase):
    id: int
    class Config:
        from_attributes = True

# SEMESTER RESULT schemas
class SemesterResultBase(BaseModel):
    semester: str
    gpa: float
    total_credits: int

class SemesterResultCreate(SemesterResultBase):
    student_username: str  # We'll use username from Excel to find the student ID

class SemesterResultResponse(SemesterResultBase):
    id: int
    student_id: int
    class Config:
        from_attributes = True
