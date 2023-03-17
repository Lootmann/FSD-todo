from typing import List

from sqlmodel import Session, select

from api.cruds import auths as auth_api
from api.models import users as user_model


def get_all_users(db: Session) -> List[user_model.User]:
    stmt = select(user_model.User)
    return db.exec(stmt).all()


def find_by_name(db: Session, user_name: str) -> user_model.User | None:
    stmt = select(user_model.User).where(user_model.User.name == user_name)
    return db.exec(stmt).first()


def create_user(db: Session, user_body: user_model.UserCreate) -> user_model.User:
    user = user_model.User(name=user_body.name)
    user.password = auth_api.get_hashed_password(user_body.password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
