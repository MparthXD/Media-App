from pydantic import BaseModel
from datetime import datetime

class CreatePostRequest(BaseModel):
    title:str
    content:str
    media_url:str | None = None

class CommentRequest(BaseModel):
    content:str

class PostResponse(BaseModel):
    id:int
    title:str
    content:str
    media_url:str | None = None
    created_at:datetime
    username:str
    likes_count:int
    is_liked_by_me:bool
   
    class Config:
        from_attributes=True
    
    

