from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, database, deps

router = APIRouter(
    prefix="/materials",
    tags=["Materials"],
)

@router.get("/", response_model=List[schemas.MaterialResponse])
def get_materials(db: Session = Depends(database.get_db)):
    return db.query(models.Material).all()

@router.post("/upload", response_model=schemas.MaterialResponse)
def upload_material(
    material: schemas.MaterialCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.require_role(["admin", "faculty"]))
):
    db_material = models.Material(
        title=material.title,
        description=material.description,
        url=material.url,
        category=material.category,
        uploaded_by=current_user.id
    )
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material
