from fastapi import APIRouter,Depends , HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.schemas import RegisterRequest
from app.auth.service import create_user
from app.auth.service import login_user
from app.auth.schemas import LoginRequest
from app.auth.dependencies import get_current_user
from app.database.models import User 
router = APIRouter()
    
@router.post("/register")
def register(data:RegisterRequest, db:Session = Depends(get_db)):
    try:
        user=create_user(
            db=db,
            username=data.username,
            email=data.email,
            password=data.password
            )
        return {"message":"User created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400,detail=str(e))
    

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    try:
        token = login_user(db, data.email, data.password)
        return {"access_token": token, "token_type": "bearer"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return{
        "id":current_user.id,
        "username":current_user.username,
        "email":current_user.email
    }
   

