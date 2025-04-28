from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
import models
import schemas
from typing import List, Optional
import auth
from sqlalchemy.orm import Session
from .auth import get_password_hash
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_document(db: AsyncSession, document: schemas.DocumentCreate) -> models.Document:
    db_document = models.Document(
        key=document.key,
        content=document.content
    )
    db.add(db_document)
    await db.commit()
    await db.refresh(db_document)
    return db_document

async def get_documents(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100
) -> List[models.Document]:
    query = select(models.Document).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

async def get_document(
    db: AsyncSession,
    document_id: int
) -> Optional[models.Document]:
    query = select(models.Document).filter(models.Document.id == document_id)
    result = await db.execute(query)
    return result.scalar_one_or_none()

async def update_document(
    db: AsyncSession,
    document_id: int,
    document: schemas.DocumentUpdate
) -> Optional[models.Document]:
    update_data = document.model_dump(exclude_unset=True)
    query = (
        update(models.Document)
        .where(models.Document.id == document_id)
        .values(**update_data)
        .returning(models.Document)
    )
    result = await db.execute(query)
    await db.commit()
    return result.scalar_one_or_none()

async def delete_document(
    db: AsyncSession,
    document_id: int
) -> bool:
    query = (
        delete(models.Document)
        .where(models.Document.id == document_id)
        .returning(models.Document.id)
    )
    result = await db.execute(query)
    await db.commit()
    return result.scalar_one_or_none() is not None

# User CRUD operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = pwd_context.hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user 