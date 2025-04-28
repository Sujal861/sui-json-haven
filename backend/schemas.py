from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class DocumentBase(BaseModel):
    key: str
    content: str

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(DocumentBase):
    key: Optional[str] = None
    content: Optional[str] = None

class Document(DocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None 