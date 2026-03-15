from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str


# --- User Profile ---
class ProfileBase(BaseModel):
    name: Optional[str] = None
    occupation: Optional[str] = None
    company: Optional[str] = None

class ProfileCreate(ProfileBase):
    user_email: str

class ProfileOut(ProfileBase):
    user_email: str

    class Config:
        from_attributes = True


# --- User Memory ---
class MemoryOut(BaseModel):
    user_email: str
    memory_text: str

    class Config:
        from_attributes = True


# --- Conversations ---
class ConversationCreate(BaseModel):
    user_email: str
    title: Optional[str] = "New Chat"

class ConversationOut(BaseModel):
    id: int
    user_email: str
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ConversationTitleUpdate(BaseModel):
    title: str


# --- Messages ---
class MessageCreate(BaseModel):
    role: str
    content: str

class MessageOut(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
