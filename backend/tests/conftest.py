from typing import Tuple

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

from api.db import get_db
from api.main import app
from api.models import auths as auth_model
from api.models import users as user_model
from tests.factory import random_string


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_db] = get_session_override

    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="login_fixture")
def login_fixture(client: TestClient) -> Tuple[user_model.User, dict]:
    user = user_model.User(
        name=random_string(), password=random_string(min_=8, max_=100)
    )
    client.post("/users", json={"name": user.name, "password": user.password})

    resp = client.post(
        "/auth/token",
        data={"username": user.name, "password": user.password},
        headers={"content-type": "application/x-www-form-urlencoded"},
    )

    token = auth_model.TokenData(**resp.json())
    headers = {"Authorization": f"Bearer {token.access_token}"}
    return user, headers
