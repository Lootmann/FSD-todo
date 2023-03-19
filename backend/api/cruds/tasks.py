from datetime import datetime
from typing import List

from sqlmodel import Session, select

from api.models import tasks as task_model
from api.models import users as user_model


def get_all_tasks(db: Session, user_id: int) -> List[task_model.Task]:
    stmt = select(task_model.Task).where(task_model.Task.user_id == user_id)
    return db.exec(stmt).all()


def find_by_id(db: Session, task_id: int, user_id: int) -> task_model.Task | None:
    stmt = (
        select(task_model.Task)
        .where(task_model.Task.id == task_id)
        .where(task_model.Task.user_id == user_id)
    )
    return db.exec(stmt).first()


def create_task(
    db: Session, task_create: task_model.TaskCreate, user: user_model.User
) -> task_model.Task:
    task_create.created_at = datetime.now()
    task_create.updated_at = datetime.now()

    db_task = task_model.Task.from_orm(task_create)
    db_task.user_id = user.id

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task


def update_task(
    db: Session, origin: task_model.Task, task: task_model.TaskUpdate
) -> task_model.Task:
    task_data = task.dict(exclude_unset=True)
    for key, value in task_data.items():
        setattr(origin, key, value)
    db.add(origin)
    db.commit()
    db.refresh(origin)
    return origin


def done_task(db: Session, task: task_model.Task) -> task_model.Task:
    task.is_done = True
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def undone_task(db: Session, task: task_model.Task) -> task_model.Task:
    task.is_done = False
    db.add(task)
    db.commit()
    db.refresh(task)
    return task
