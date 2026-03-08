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

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    id: int
    date_posted: datetime

    class Config:
        from_attributes = True

# JWT Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
