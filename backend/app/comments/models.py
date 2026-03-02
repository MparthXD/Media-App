from sqlalchemy import Column , Integer , String , Text, DateTime ,ForeignKey
from datetime import datetime
from app.database.session import Base
from sqlalchemy.orm import relationship

class Comment(Base):
    __tablename__="comments"
    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer,ForeignKey("users.id"),nullable=False)
    post_id=Column(Integer,ForeignKey("posts.id"),nullable=False)
    content=Column(Text , nullable=False)
    created_at=Column(DateTime, default=datetime.utcnow)
    user=relationship("User", back_populates="comments")
    post=relationship("Post", back_populates="comments")
    
