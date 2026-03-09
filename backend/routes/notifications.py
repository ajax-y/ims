from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models, schemas, database, deps

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)

@router.get("/", response_model=List[schemas.NotificationResponse])
def get_notifications(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.require_role(["student", "faculty", "admin"]))
):
    # Fetch notifications: 
    # 1. Meant for 'all'
    # 2. Meant for the specific user's role
    # 3. Specifically for this user ID
    notifications = db.query(models.Notification).filter(
        (models.Notification.recipient_role == "all") |
        (models.Notification.recipient_role == current_user.role) |
        (models.Notification.recipient_id == current_user.id)
    ).order_by(models.Notification.date_posted.desc()).all()
    return notifications

@router.patch("/{notification_id}/read", response_model=schemas.NotificationResponse)
def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.require_role(["student", "faculty", "admin"]))
):
    db_notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        (models.Notification.recipient_id == current_user.id) | (models.Notification.recipient_role.in_(["all", current_user.role]))
    ).first()
    
    if not db_notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    db_notification.is_read = True
    db.commit()
    db.refresh(db_notification)
    return db_notification

@router.post("/", response_model=schemas.NotificationResponse)
def create_notification(
    notification: schemas.NotificationCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.require_role(["admin"]))
):
    db_notification = models.Notification(
        title=notification.title,
        message=notification.message,
        recipient_role=notification.recipient_role,
        recipient_id=notification.recipient_id
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification
