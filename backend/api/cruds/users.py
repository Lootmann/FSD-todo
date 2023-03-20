from typing import List

from sqlmodel import Session, select

from api.cruds import auths as auth_api
from api.models import users as user_model


def get_all_users(db: Session) -> List[user_model.User]:
    stmt = select(user_model.User)
    return db.exec(stmt).all()


def find_by_name(db: Session, user_name: str) -> user_model.User | None:
    stmt = select(user_model.User).where(user_model.User.username == user_name)
    return db.exec(stmt).first()


def create_user(db: Session, user_body: user_model.UserCreate) -> user_model.User:
    user = user_model.User(username=user_body.username)
    user.password = auth_api.get_hashed_password(user_body.password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, origin: user_model.User, user: user_model.UserUpdate):
    user_data = user.dict(exclude_unset=True)
    for key, value in user_data.items():
        if key == "password":
            setattr(origin, key, auth_api.get_hashed_password(value))
        else:
            setattr(origin, key, value)
    db.add(origin)
    db.commit()
    db.refresh(origin)
    return origin


def delete_user(db: Session, origin: user_model.User) -> None:
    db.delete(origin)
    db.commit()
    return
