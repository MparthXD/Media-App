from fastapi import FastAPI
from app.database.session import engine
from app.database.models import Base
from app.auth.routes import router as auth_router
from app.posts.routes import router as posts_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

Base.metadata.create_all(bind=engine)
app.include_router(auth_router, prefix="/auth")
app.include_router(posts_router,prefix="/posts")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "API running"}
