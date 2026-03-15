from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash, verify_password
from typing import Optional
from datetime import datetime


# --- Users ---
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_or_create_user(db: Session, email: str):
    user = get_user_by_email(db, email)
    if not user:
        user = models.User(email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# --- User Profile ---
def get_profile(db: Session, user_email: str) -> Optional[models.UserProfile]:
    return db.query(models.UserProfile).filter(models.UserProfile.user_email == user_email).first()

def upsert_profile(db: Session, profile: schemas.ProfileCreate) -> models.UserProfile:
    db_profile = get_profile(db, profile.user_email)
    if db_profile:
        db_profile.name = profile.name
        db_profile.occupation = profile.occupation
        db_profile.company = profile.company
    else:
        db_profile = models.UserProfile(**profile.model_dump())
        db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


# --- User Memory ---
def get_memory(db: Session, user_email: str) -> Optional[models.UserMemory]:
    return db.query(models.UserMemory).filter(models.UserMemory.user_email == user_email).first()

def update_memory(db: Session, user_email: str, memory_text: str) -> models.UserMemory:
    db_memory = get_memory(db, user_email)
    if db_memory:
        db_memory.memory_text = memory_text
    else:
        db_memory = models.UserMemory(user_email=user_email, memory_text=memory_text)
        db.add(db_memory)
    db.commit()
    db.refresh(db_memory)
    return db_memory


# --- Conversations ---
def get_conversations(db: Session, user_email: str):
    return (
        db.query(models.Conversation)
        .filter(models.Conversation.user_email == user_email)
        .order_by(models.Conversation.updated_at.desc())
        .all()
    )

def create_conversation(db: Session, conversation: schemas.ConversationCreate) -> models.Conversation:
    db_conv = models.Conversation(
        user_email=conversation.user_email,
        title=conversation.title or "New Chat"
    )
    db.add(db_conv)
    db.commit()
    db.refresh(db_conv)
    return db_conv

def update_conversation_title(db: Session, conversation_id: int, title: str) -> Optional[models.Conversation]:
    db_conv = db.query(models.Conversation).filter(models.Conversation.id == conversation_id).first()
    if db_conv:
        db_conv.title = title
        db_conv.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_conv)
    return db_conv

def delete_conversation(db: Session, conversation_id: int):
    db_conv = db.query(models.Conversation).filter(models.Conversation.id == conversation_id).first()
    if db_conv:
        db.delete(db_conv)
        db.commit()


# --- Messages ---
def get_messages(db: Session, conversation_id: int):
    return (
        db.query(models.Message)
        .filter(models.Message.conversation_id == conversation_id)
        .order_by(models.Message.created_at.asc())
        .all()
    )

def add_message(db: Session, conversation_id: int, message: schemas.MessageCreate) -> models.Message:
    db_msg = models.Message(
        conversation_id=conversation_id,
        role=message.role,
        content=message.content,
    )
    db.add(db_msg)
    # Also bump conversation updated_at
    db.query(models.Conversation).filter(models.Conversation.id == conversation_id).update(
        {"updated_at": datetime.utcnow()}
    )
    db.commit()
    db.refresh(db_msg)
    return db_msg
