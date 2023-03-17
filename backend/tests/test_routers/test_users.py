from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session

from api.cruds.auths import verify_password
from tests.factory import UserFactory, random_string


class TestGETUser:
    def test_get_all_user(self, client: TestClient, login_fixture):
        _, headers = login_fixture
        resp = client.get("/users", headers=headers)
        assert resp.status_code == status.HTTP_200_OK

    def test_get_all_user_without_authenticated(self, client: TestClient):
        resp = client.get("/users")
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED


class TestPOSTUser:
    def test_create_user(self, client: TestClient):
        resp = client.post(
            "/users", json={"name": random_string(), "password": random_string()}
        )
        assert resp.status_code == status.HTTP_201_CREATED

    def test_create_many_users(self, client: TestClient, login_fixture):
        for _ in range(9):
            resp = client.post(
                "/users", json={"name": random_string(), "password": random_string()}
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
        assert verify_password(password, user.password) is True
