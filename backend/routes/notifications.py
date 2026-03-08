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
    # Fetch notifications meant for 'all' or the specific user's role
    notifications = db.query(models.Notification).filter(
        models.Notification.recipient_role.in_(["all", current_user.role])
    ).all()
    return notifications

@router.post("/", response_model=schemas.NotificationResponse)
def create_notification(
    notification: schemas.NotificationCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.require_role(["admin"]))
):
    db_notification = models.Notification(
        title=notification.title,
        message=notification.message,
        recipient_role=notification.recipient_role
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification
