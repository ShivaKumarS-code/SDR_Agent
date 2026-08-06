from fastapi import HTTPException
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from fastapi import Depends
from sqlmodel import Session, select
from db.database import get_session
from core.security import hash_password, verify_password, create_access_token
from db.models.user import User
from jose import JWTError
from core.security import oauth2_scheme, decode_access_token

class RegisterRequest(BaseModel):
    name: str
    email : EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

def get_current_user(token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)):
    try:
        payload = decode_access_token(token)
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    user = session.get(User, user_id)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    return user


router = APIRouter(prefix='/auth', tags=['Authentication'])

@router.post("/register")
def register(data: RegisterRequest, session: Session = Depends(get_session)):
    existing_user = session.exec(
        select(User).where(User.email == data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User Already exists.."
        )

    user = User(
        name = data.name,
        email = data.email,
        hashed_password = hash_password(data.password)
    )

    session.add(user)
    session.commit()
    session.refresh(user)
    return {
        "message": "User created successfully"
    }


@router.post('/login')
def login(data: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(
        select(User).where(User.email == data.email)
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials"
        )

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials"
        )

    access_token = create_access_token(
        {
            "sub": str(user.id),
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.get("/me")
def me(
    current_user: User = Depends(get_current_user),
):
    return current_user