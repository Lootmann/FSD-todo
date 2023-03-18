from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from api.cruds import auths as auth_api
from api.cruds import users as user_api
from api.db import get_db
from api.models import users as user_model

router = APIRouter(tags=["users"], prefix="/users")


@router.get(
    "",
    response_model=List[user_model.UserRead],
    status_code=status.HTTP_200_OK,
)
def get_all_users(
    *,
    db: Session = Depends(get_db),
    current_user=Depends(auth_api.get_current_active_user),
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authenticated",
        )
    return user_api.get_all_users(db)


@router.post(
    "",
    response_model=user_model.UserRead,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    *,
    db: Session = Depends(get_db),
    user: user_model.UserCreate,
):
    return user_api.create_user(db, user)


@router.patch(
    "",
    response_model=user_model.UserRead,
    status_code=status.HTTP_200_OK,
)
def update_user(
    *,
    db: Session = Depends(get_db),
    user: user_model.UserUpdate,
    current_user=Depends(auth_api.get_current_active_user),
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authenticated",
        )
    return user_api.update_user(db, current_user, user)

