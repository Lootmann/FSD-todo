from datetime import timedelta

from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from api.cruds import auths as auth_api
from api.cruds import users as user_api
from api.db import get_db
from api.models import auths as auth_model
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
    found = user_api.find_by_name(db, form_data.username)

    if not found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User Not Found",
        )

    if not auth_api.verify_password(form_data.password, found.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="username or password is wrong",
        )

    access_token_expires = timedelta(minutes=credential.access_token_expire_minutes)
    data = {"sub": form_data.username}
    access_token = auth_api.create_access_token(data, access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}
