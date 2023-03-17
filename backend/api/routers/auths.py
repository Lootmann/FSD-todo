from datetime import timedelta

from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from api.cruds import auths as auth_api
from api.db import get_db
from api.models import auths as auth_model
from api.models import users as user_model
from api.settings import Settings

credential = Settings()
router = APIRouter(tags=["auth"], prefix="/auth")


@router.post(
    "/token",
    response_model=auth_model.TokenData,
    status_code=status.HTTP_200_OK,
)
def login_user(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    found_user: user_model.User = auth_api.authenticate_user(
        db, form_data.username, form_data.password
    )

    if not found_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User Not Found"
        )

    access_token_expires = timedelta(minutes=credential.access_token_expire_minutes)
    data = {"sub": found_user.name}
    access_token = auth_api.create_access_token(data, access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}
