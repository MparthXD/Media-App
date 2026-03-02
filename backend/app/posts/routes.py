from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

from app.posts.service import (
    create_post,
    get_posts,
    all_posts,
    get_posts_by_id,
    delete_post,
    toggle_like,
    add_comment,
)
from app.posts.schemas import CreatePostRequest, CommentRequest, PostResponse
from app.auth.dependencies import get_current_user, get_current_user_optional
from app.database.session import get_db
from app.comments.service import get_comments_by_post, delete_comment
from app.likes.models import Like

router = APIRouter()

@router.post("/create", status_code=201)
def create_post_endpoint(
    data: CreatePostRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_post(
        db=db,
        current_user=current_user,
        title=data.title,
        content=data.content,
        media_url=data.media_url,
    )

@router.get("/me", response_model=list[PostResponse])
def get_my_posts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),  # require a logged‑in user
):
    return get_posts(db, current_user)

@router.get("/", response_model=list[PostResponse])
def get_all_posts(
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    return all_posts(db, current_user, limit, offset)

@router.get("/{post_id}", response_model=PostResponse)
def get_post_by_id(
    post_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    try:
        post = get_posts_by_id(db, post_id)

        likes_count = db.query(Like).filter(Like.post_id == post.id).count()
        liked = False
        if current_user:
            liked = (
                db.query(Like)
                .filter(Like.post_id == post.id, Like.user_id == current_user.id)
                .first()
                is not None
            )

        return PostResponse(
            id=post.id,
            title=post.title,
            content=post.content,
            media_url=post.media_url,
            created_at=post.created_at,
            username=post.user.username,
            likes_count=likes_count,
            is_liked_by_me=liked,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{post_id}")
def delete_by_post(
    post_id:int,
    db:Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        result=delete_post(db,post_id,current_user)
        return result
    except ValueError as e:
        if "Unauthorized" in str(e):
            raise HTTPException(status_code=403,detail=str(e))
        else:
            raise HTTPException(status_code=404,detail=str(e))

        
@router.post("/{post_id}/like")
def toggle_like_endpoint(
    post_id:int, 
    db:Session = Depends(get_db), 
    current_user=Depends(get_current_user)
    ):
    try:
        result=toggle_like(db,post_id,current_user)
        return result
    except ValueError as e:
        if "post not found" in str(e).lower():
            raise HTTPException(status_code=404,detail=str(e))
        else:
            raise HTTPException(status_code=400,detail=str(e))



@router.post("/{post_id}/comments")
def comment_on_post(
    
    post_id:int,
    data:CommentRequest,
    db:Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
     comment=add_comment(db,post_id,current_user,data.content)
     return comment
    except ValueError as e:
        raise HTTPException(status_code=404,detail=str(e))


    
@router.get("/{post_id}/comments")
def get_comments(
    post_id:int,
    limit:int=10,
    offset:int=0,
    db:Session = Depends(get_db)
):
    
    try:
        comments=get_comments_by_post(db,post_id,limit,offset)
        return comments
    except ValueError as e:
        raise HTTPException(status_code=404,detail=str(e))


@router.delete("/comments/{comment_id}")
def delete_comment_endpoint(
    comment_id:int,
    db:Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        result=delete_comment(db,comment_id,current_user)
        return result
    except ValueError as e:
        if"Unauthorized" in str(e):
            raise HTTPException(status_code=403,detail=str(e))
        else:
            raise HTTPException(status_code=404,detail=str(e))








