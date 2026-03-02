from sqlalchemy.orm import Session
from app.comments.models import Comment
from app.posts.models import Post
def get_comments_by_post(db:Session,post_id:int,limit:int=10,offset:int=0):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise ValueError("Post not found")
    comments = (
        db.query(Comment)
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return comments

def delete_comment(db:Session,comment_id:int,current_user):
    comment=db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise ValueError("Comment not found")
    if comment.user_id != current_user.id:
        raise ValueError("Unauthorized to delete this comment")
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"}