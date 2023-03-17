from random import randint, sample
from string import ascii_letters

from sqlmodel import Session

from api.cruds import auths as auth_crud
from api.models import users as user_model


def random_string(min_: int = 5, max_: int = 10) -> str:
    s = ascii_letters
    while max_ > len(s):
        s += s
    return "".join(sample(ascii_letters, randint(min_, max_)))


class UserFactory:
    @staticmethod
    def create_user(db: Session, name: str, password: str) -> user_model.User:
        user = user_model.User(
            name=name,
            password=auth_crud.get_hashed_password(password),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
