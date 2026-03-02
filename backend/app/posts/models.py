from sqlalchemy import Column , Integer , String , Text, DateTime ,ForeignKey
from datetime import datetime
from app.database.session import Base
from sqlalchemy.orm import relationship

class Post(Base):
    __tablename__="posts"
    id=Column(Integer,primary_key=True,index=True)
    title=Column(String, nullable=False)
    content=Column(Text , nullable=False)
    media_url=Column(String, nullable=True)
    created_at=Column(DateTime, default=datetime.utcnow)
    user_id=Column(Integer, ForeignKey("users.id"), nullable=False)
    user =relationship("User",back_populates="posts")
    likes = relationship("Like", back_populates="post")
    comments = relationship("Comment", back_populates="post")
    