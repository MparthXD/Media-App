from sqlalchemy.orm import Session
from app.posts.models import Post
from app.likes.models import Like
from app.comments.models import Comment
from app.posts.schemas import PostResponse

def create_post(db: Session, current_user, title: str, content: str, media_url: str | None = None):
    post = Post(
        title=title,
        content=content,
        media_url=media_url,
        user_id=current_user.id
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

def get_posts(db: Session, current_user):
    posts = db.query(Post).filter(Post.user_id == current_user.id).all()
    return posts

def all_posts(db: Session, current_user, limit: int = 10, offset: int = 0):
    posts_all = (
        db.query(Post)
        .order_by(Post.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    result: list[PostResponse] = []

    for post in posts_all:
        likes_count = db.query(Like).filter(Like.post_id == post.id).count()
        liked = False
        if current_user:
            liked = (
                db.query(Like)
                .filter(Like.post_id == post.id, Like.user_id == current_user.id)
                .first()
                is not None
            )

        result.append(
            PostResponse(
                id=post.id,
                title=post.title,
                content=post.content,
                media_url=post.media_url,
                created_at=post.created_at,
                username=post.user.username,
                likes_count=likes_count,
                is_liked_by_me=liked,
            )
        )

    return result

def get_posts_by_id(db: Session, post_id:int):
    post=db.query(Post).filter(Post.id == post_id).first()
    
    if not post:
     raise ValueError("Post not Found")


    return post 

def delete_post(db: Session, post_id:int, current_user):
   post=db.query(Post).filter(Post.id == post_id).first()
   if not post:
      raise ValueError("Post not found")
   if post.user_id != current_user.id:
      raise ValueError("Unauthorized to delete this post")
   db.delete(post)
   db.commit()
   return {"message": "Post deleted successfully"}

def toggle_like(db: Session,post_id:int, current_user):
   post=db.query(Post).filter(Post.id == post_id).first()
   if_like_exist=db.query(Like).filter(Like.post_id == post_id, Like.user_id == current_user.id).first()
   if not post:
      raise ValueError("Post not found")
   existing_like=db.query(Like).filter(
      Like.post_id == post.id,
      Like.user_id == current_user.id
   ).first()
      
   if existing_like:
      db.delete(existing_like)
      db.commit()
      return{"status":"unliked"}
   
   new_like =Like(post_id=post.id, user_id=current_user.id )
   db.add(new_like)
   db.commit()
   return{"status":"liked"}


def add_comment(db: Session, post_id:int , current_user, content:str):
   post=db.query(Post).filter(Post.id == post_id).first()
   if not post:
      raise ValueError("Post not found")
   new_comment=Comment(
      user_id=current_user.id,
      post_id=post_id,
      content=content
   )
   db.add(new_comment)
   db.commit()
   db.refresh(new_comment)
   return new_comment