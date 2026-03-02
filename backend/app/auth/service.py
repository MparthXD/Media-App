from sqlalchemy.orm import Session
from app.database.models import User
from app.core.security import hash_password
from app.core.security import verify_password
from app.core.security import create_access_token

def create_user(db: Session, username:str , email:str, password:str):
    existing = db.query(User).filter(
        (User.email == email) | (User.username == username)
    ).first()

    if existing:
        raise ValueError("User already Exists")
    


    hashed=hash_password(password)
    


    user=User(
        username=username,
        email=email,
        password_hash=hashed

    )
    db.add(user)
    db.commit()
    db.refresh(user)



    return user

def authenticate_user(db: Session,email:str , password:str):
    user =db.query(User).filter(User.email == email).first()

    if not user:
        raise ValueError("Invalid credentials")
    
    if not verify_password(password , user.password_hash):
        raise ValueError("Invalid credentials")
    
    return user 

def login_user(db: Session, email: str, password: str):
    user = authenticate_user(db, email, password)

    token = create_access_token({"sub": user.email})

    return token