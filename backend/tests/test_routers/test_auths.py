from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session

from api.cruds import users as user_api
from api.models import users as user_model
from tests.factory import random_string


class TestAuth:
    def test_get_auth_token_without_correct_user(self, client: TestClient):
        resp = client.post(
            "/auth/token",
            data={"username": "hogehoge", "password": "1i9damldn9"},
            headers={"content-type": "application/x-www-form-urlencoded"},
        )
        data = resp.json()

        assert resp.status_code == status.HTTP_404_NOT_FOUND
        assert data == {"detail": "User Not Found"}

    def test_get_auth_token_with_incorrect_password(
        self, client: TestClient, session: Session
    ):
        username, password = random_string(), random_string(min_=8, max_=8)
        user_data = user_model.UserCreate(name=username, password=password)
        user_api.create_user(session, user_data)

        resp = client.post(
            "/auth/token",
            data={"username": username, "password": "mogege"},
            headers={"content-type": "application/x-www-form-urlencoded"},
        )
        data = resp.json()

        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
        assert data == {"detail": "username or password is wrong"}

    def test_get_auth_token_with_user(self, client: TestClient, session: Session):
        username, password = random_string(), random_string(min_=8, max_=8)
        user_data = user_model.UserCreate(name=username, password=password)
        user_api.create_user(session, user_data)

        resp = client.post(
            "/auth/token",
            data={"username": username, "password": password},
            headers={"content-type": "application/x-www-form-urlencoded"},
        )
        data = resp.json()

        assert resp.status_code == status.HTTP_200_OK
        assert "access_token" in data
        assert "token_type" in data
