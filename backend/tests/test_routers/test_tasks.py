from datetime import date, timedelta

from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session

from tests.factory import AuthFactory, TaskFactory, UserFactory


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
        resp = client.post(
            "/tasks",
            json={"title": "first task", "description": "hello"},
            headers=headers,
        )
        task_id = resp.json()["id"]

        # get task by id
        resp = client.get(f"/tasks/{task_id}", headers=headers)
        data = resp.json()

        assert resp.status_code == status.HTTP_200_OK
        assert data["id"] == task_id
        assert data["title"] == "first task"
        assert data["description"] == "hello"

    def test_get_task_with_wrong_task_id(self, client: TestClient, login_fixture):
        user, headers = login_fixture

        resp = client.get("/tasks/123", headers=headers)
        assert resp.status_code == status.HTTP_404_NOT_FOUND

    def test_get_task_with_wrong_user(
        self, client: TestClient, session: Session, login_fixture
    ):
        user, headers = login_fixture
        resp = client.post(
            "/tasks",
            json={"title": "first task", "description": "hello world"},
            headers=headers,
        )
        task_id = resp.json()["id"]

        UserFactory.create_user(session, username="other", password="hogehoge123")
        other_header = AuthFactory.create_token(client, "other", "hogehoge123")

        # get task by a different user
        resp = client.get(f"/tasks/{task_id}", headers=other_header)
        assert resp.status_code == status.HTTP_404_NOT_FOUND

    def test_get_tasks_filtered_by_done_flag(
        self, client: TestClient, session: Session, login_fixture
    ):
        user, headers = login_fixture

        TaskFactory.create_many_tasks(
            db=session, num_of_task=2, user_id=user.id, is_done=False
        )
        TaskFactory.create_many_tasks(
            db=session, num_of_task=3, user_id=user.id, is_done=True
        )

        resp = client.get("/tasks", headers=headers)
        data = resp.json()
        assert len(data) == 2

        resp = client.get("/tasks?done=True", headers=headers)
        data = resp.json()
        assert len(data) == 3

    def test_get_tasks_query_params_limit_and_offset(
        self, client: TestClient, session: Session, login_fixture
    ):
        user, headers = login_fixture
        TaskFactory.create_many_tasks(db=session, num_of_task=150, user_id=user.id)

        resp = client.get("/tasks", headers=headers)
        data = resp.json()
        assert len(data) == 100

        resp = client.get("/tasks?limit=50", headers=headers)
        data = resp.json()
        assert len(data) == 50

        resp = client.get("/tasks?offset=50&limit=50", headers=headers)
        data = resp.json()
        assert len(data) == 50

        resp = client.get("/tasks?limit=200", headers=headers)
        data = resp.json()
        assert (
            data["detail"][0]["msg"] == "ensure this value is less than or equal to 100"
        )


class TestPostTask:
    def test_create_task_with_empty(self, client: TestClient, login_fixture):
        user, headers = login_fixture

        resp = client.post("/tasks", json={}, headers=headers)
        data = resp.json()

        assert resp.status_code == status.HTTP_201_CREATED
        assert data["id"] is not None
        assert data["title"] == ""
        assert data["description"] == ""
        assert data["priority"] == 0
        assert data["is_done"] is False
        assert data["expired_at"] is None

    def test_create_task_with_field(self, client: TestClient, login_fixture):
        user, headers = login_fixture

        resp = client.post(
            "/tasks",
            json={
                "title": "well hello friends :^)",
                "description": "how are you?",
                "expired_at": str(date.today() + timedelta(days=10)),
            },
            headers=headers,
        )
        data = resp.json()

        assert resp.status_code == status.HTTP_201_CREATED
        assert data["id"] is not None
        assert data["expired_at"] is not None
        assert data["title"] == "well hello friends :^)"
        assert data["description"] == "how are you?"

    def test_done_task(self, client: TestClient, session: Session, login_fixture):
        user, headers = login_fixture
        task = TaskFactory.create_task(session, user.id)

        resp = client.get(f"/tasks/{task.id}", headers=headers)
        data = resp.json()
        assert data["is_done"] is False

        resp = client.post(f"/tasks/{task.id}/done", headers=headers)
        data = resp.json()
        assert data["is_done"] is True

    def test_done_task_with_wrong_id(self, client: TestClient, login_fixture):
        _, headers = login_fixture
        resp = client.post("/tasks/321/done", headers=headers)
        data = resp.json()
        assert resp.status_code == status.HTTP_404_NOT_FOUND
        assert data == {"detail": "Task 321: Not Found"}

    def test_undone_task(self, client: TestClient, session: Session, login_fixture):
        user, headers = login_fixture
        task = TaskFactory.create_task(session, user.id)

        resp = client.post(f"/tasks/{task.id}/done", headers=headers)
        data = resp.json()
        assert data["is_done"] is True

        resp = client.post(f"/tasks/{task.id}/undone", headers=headers)
        data = resp.json()
        assert data["is_done"] is False

    def test_undone_task_with_wrong_id(self, client: TestClient, login_fixture):
        _, headers = login_fixture
        resp = client.post("/tasks/321/undone", headers=headers)
        data = resp.json()
        assert resp.status_code == status.HTTP_404_NOT_FOUND
        assert data == {"detail": "Task 321: Not Found"}


class TestPatchTask:
    def test_update_task_with_empty_payload(
        self, client: TestClient, session: Session, login_fixture
    ):
        user, headers = login_fixture
        task = TaskFactory.create_task(session, user.id)

        resp = client.patch(f"/tasks/{task.id}", json={}, headers=headers)
        assert resp.status_code == status.HTTP_200_OK

    def test_update_task_with_payloads(
        self, client: TestClient, session: Session, login_fixture
    ):
        user, headers = login_fixture
        task = TaskFactory.create_task(session, user.id)

        resp = client.patch(
            f"/tasks/{task.id}",
            json={
                "title": "updated :^)",
                "description": "updated :^)",
                "priority": 3,
                "expired_at": str(date.today() + timedelta(days=10)),
            },
            headers=headers,
        )
        data = resp.json()

        assert resp.status_code == status.HTTP_200_OK
        assert data["title"] == "updated :^)"
        assert data["description"] == "updated :^)"
        assert data["priority"] == 3
        assert "expired_at" in data
        assert data["expired_at"] is not None

    def test_update_task_with_wrong_task_id(
        self, client: TestClient, session: Session, login_fixture
    ):
        user, headers = login_fixture

        resp = client.patch("/tasks/123", json={}, headers=headers)
        data = resp.json()
        assert resp.status_code == status.HTTP_404_NOT_FOUND
        assert data == {"detail": "Task 123: Not Found"}


class TestDeleteTask:
    def test_delete_task(self, client: TestClient, login_fixture):
        user, headers = login_fixture

        resp = client.post("/tasks", json={}, headers=headers)
        task_id = resp.json()["id"]

        resp = client.get("/tasks", headers=headers)
        assert len(resp.json()) == 1

        resp = client.delete(f"/tasks/{task_id}", headers=headers)
        data = resp.json()
        assert resp.status_code == status.HTTP_200_OK
        assert data is None

    def test_delete_task_with_wrong_id(self, client: TestClient, login_fixture):
        user, headers = login_fixture

        resp = client.delete("/tasks/123", headers=headers)
        assert resp.status_code == status.HTTP_404_NOT_FOUND
