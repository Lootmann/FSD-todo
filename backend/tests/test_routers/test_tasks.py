from datetime import date, timedelta

from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session

from tests.factory import AuthFactory, UserFactory


class TestGetTask:
    def test_get_all_tasks(self, client: TestClient, login_fixture):
        _, headers = login_fixture
        resp = client.get("/tasks", headers=headers)
        assert resp.status_code == status.HTTP_200_OK

    def test_get_all_tasks_without_authenticated(self, client: TestClient):
        resp = client.get("/tasks")
        data = resp.json()

        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
        assert data == {"detail": "Not authenticated"}

    def test_get_task_by_task_id(self, client: TestClient, login_fixture):
        user, headers = login_fixture

        # create task
        resp = client.post("/tasks", json={"comment": "first task"}, headers=headers)
        task_id = resp.json()["id"]

        # get task by id
        resp = client.get(f"/tasks/{task_id}", headers=headers)
        data = resp.json()

        assert resp.status_code == status.HTTP_200_OK
        assert data["id"] == task_id
        assert data["comment"] == "first task"

    def test_get_task_with_wrong_task_id(self, client: TestClient, login_fixture):
        user, headers = login_fixture

        resp = client.get("/tasks/123", headers=headers)
        assert resp.status_code == status.HTTP_404_NOT_FOUND

    def test_get_task_with_wrong_user(
            self, client: TestClient, session: Session, login_fixture
    ):
        user, headers = login_fixture
        resp = client.post("/tasks", json={"comment": "first task"}, headers=headers)
        task_id = resp.json()["id"]

        UserFactory.create_user(session, name="other", password="hogehoge123")
        other_header = AuthFactory.create_token(client, "other", "hogehoge123")

        # get task by a different user
        resp = client.get(f"/tasks/{task_id}", headers=other_header)
        assert resp.status_code == status.HTTP_404_NOT_FOUND


class TestPostTask:
    def test_create_task_with_empty(self, client: TestClient, login_fixture):
        user, headers = login_fixture

        resp = client.post("/tasks", json={}, headers=headers)
        data = resp.json()

        assert resp.status_code == status.HTTP_201_CREATED
        assert data["id"] is not None
        assert data["comment"] == ""
        assert data["priority"] == 0
        assert data["is_done"] is False
        assert data["expired_at"] is None

    def test_create_task_with_comment(self, client: TestClient, login_fixture):
        user, headers = login_fixture

        resp = client.post(
            "/tasks",
            json={
                "comment": "well hello friends :^)",
                "expired_at": str(date.today() + timedelta(days=10)),
            },
            headers=headers,
        )
        data = resp.json()

        assert resp.status_code == status.HTTP_201_CREATED
        assert data["id"] is not None
        assert data["expired_at"] is not None
