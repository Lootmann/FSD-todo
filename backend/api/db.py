from sqlmodel import Session, create_engine

from api.models.tasks import Task
from api.models.users import User
from api.settings import Settings

credential = Settings()
engine = create_engine(credential.db_url, echo=True)


def get_db():
    with Session(engine) as session:
        yield session


if __name__ == "__main__":
    from api.cruds.auths import get_hashed_password

    User.metadata.drop_all(engine)
    User.metadata.create_all(engine)

    Task.metadata.drop_all(engine)
    Task.metadata.create_all(engine)

    # NOTE: create test user
    with Session(engine) as session:
        user = User(username="toortoor", password=get_hashed_password("toortoor"))
        session.add(user)
        session.commit()
        session.refresh(user)

        task = Task(
            title="first task",
            description="this is a description",
            priority=2,
            user_id=user.id,
        )
        session.add(task)
        session.commit()

        task = Task(
            title="second task",
            description=":^)",
            priority=0,
            user_id=user.id,
        )
        session.add(task)
        session.commit()
