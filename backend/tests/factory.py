from datetime import datetime
from random import randint, sample
from string import ascii_letters

from fastapi.testclient import TestClient
from sqlmodel import Session

from api.cruds import auths as auth_crud
from api.models import auths as auth_model
from api.models import tasks as task_model
from api.models import users as user_model


def random_string(min_: int = 5, max_: int = 10) -> str:
    s = ascii_letters
    while max_ > len(s):
        s += s
    return "".join(sample(s, randint(min_, max_)))


class UserFactory:
    @staticmethod
    def create_user(db: Session, username: str, password: str) -> user_model.User:
        user = user_model.User(
            username=username,
            password=auth_crud.get_hashed_password(password),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user


class TaskFactory:
    @staticmethod
    def create_task(
        db: Session, user_id: int, comment: str = random_string()
    ) -> task_model.Task:
        task = task_model.Task()
        task.created_at = datetime.now()
        task.updated_at = datetime.now()
        task.comment = comment
        task.user_id = user_id

        db.add(task)
        db.commit()
        db.refresh(task)

        return task


class AuthFactory:
    @staticmethod
    def create_token(client: TestClient, username: str, password: str) -> dict:
        resp = client.post(
            "/auth/token",
            data={"username": username, "password": password},
            headers={"content-type": "application/x-www-form-urlencoded"},
        )

        token = auth_model.TokenData(**resp.json())
        return {"Authorization": f"Bearer {token.access_token}"}
