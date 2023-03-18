from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session

from api.cruds import auths as auth_api
from api.models import users as user_model
from tests.factory import UserFactory, random_string


class TestGETUser:
    def test_get_all_users(self, client: TestClient, login_fixture):
        _, headers = login_fixture
        resp = client.get("/users", headers=headers)
        assert resp.status_code == status.HTTP_200_OK

    def test_get_all_user_without_authenticated(self, client: TestClient):
        resp = client.get("/users")
        data = resp.json()

        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
        assert data == {"detail": "Not authenticated"}


class TestPOSTUser:
    def test_create_user(self, client: TestClient):
        resp = client.post(
            "/users",
            json={"name": random_string(), "password": random_string(min_=8, max_=100)},
        )
        assert resp.status_code == status.HTTP_201_CREATED

    def test_create_many_users(self, client: TestClient, login_fixture):
        for _ in range(9):
            resp = client.post(
                "/users",
                json={
                    "name": random_string(),
                    "password": random_string(min_=8, max_=100),
                },
            )
            assert resp.status_code == status.HTTP_201_CREATED

        _, headers = login_fixture

        resp = client.get("/users", headers=headers)
        data = resp.json()

        assert resp.status_code == status.HTTP_200_OK
        assert len(data) == 10

    def test_create_user_factory(self, client: TestClient, session: Session):
        name, password = random_string(), random_string()
        user = UserFactory.create_user(session, name=name, password=password)

        assert user.name == name
        assert auth_api.verify_password(password, user.password) is True


class TestPatchUser:
    def test_update_user_only_with_name(self, client: TestClient, login_fixture):
        user, headers = login_fixture
        user_data = {"name": "updated :^)"}

        resp = client.patch("/users", json=user_data, headers=headers)
        data = resp.json()

        assert resp.status_code == status.HTTP_200_OK
        assert data["name"] == "updated :^)"

    def test_update_user_only_with_password(
        self, client: TestClient, session: Session, login_fixture
    ):
        user, headers = login_fixture
        user_data = {"password": "updated :^)"}

        resp = client.patch("/users", json=user_data, headers=headers)
        assert resp.status_code == status.HTTP_200_OK

        update_user = session.get(user_model.User, user.id)
        assert auth_api.verify_password("updated :^)", update_user.password) is True

    def test_update_user_with_short_name(self, client: TestClient, login_fixture):
        user, headers = login_fixture
        user_data = {"name": "1"}

        resp = client.patch("/users", json=user_data, headers=headers)
        assert resp.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_update_user_with_short_password(self, client: TestClient, login_fixture):
        user, headers = login_fixture
        user_data = {"password": ":^)"}

        resp = client.patch("/users", json=user_data, headers=headers)
        assert resp.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestDeleteUser:
    def test_delete_user(self, client: TestClient, login_fixture):
        user, headers = login_fixture

        resp = client.delete("/users", headers=headers)
        data = resp.json()

        assert resp.status_code == status.HTTP_200_OK
        assert data is None
