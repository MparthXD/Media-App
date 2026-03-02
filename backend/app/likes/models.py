from sqlalchemy import Column, Integer, String, Text, DateTime,ForeignKey
from datetime import datetime
from app.database.session import Base
from sqlalchemy.orm import relationship

class Like(Base):
    __tablename__="likes"
   
    user_id=Column(Integer,ForeignKey("users.id"),primary_key=True,nullable=False)
    post_id=Column(Integer,ForeignKey("posts.id"),primary_key=True,nullable=False)
    created_at=Column(DateTime,default=datetime.utcnow)
    user=relationship("User",back_populates="likes")
    post=relationship("Post",back_populates="likes")
    
