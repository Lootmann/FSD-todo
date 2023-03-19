from typing import List

from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from api.cruds import auths as auth_api
from api.cruds import tasks as task_api
from api.cruds.custom_exceptions import TaskException
from api.db import get_db
from api.models import tasks as task_model

router = APIRouter(tags=["tasks"], prefix="/tasks")


@router.get(
    "",
    response_model=List[task_model.TaskRead],
    status_code=status.HTTP_200_OK,
)
def get_all_tasks(
    *,
    db: Session = Depends(get_db),
    current_user=Depends(auth_api.get_current_user),
):
    return task_api.get_all_tasks(db, current_user.id)


@router.get(
    "/{task_id}",
    response_model=task_model.TaskRead,
    status_code=status.HTTP_200_OK,
)
def get_task_by_id(
    *,
    db: Session = Depends(get_db),
    task_id: int,
    current_user=Depends(auth_api.get_current_user),
):
    # TODO: when difference user try to get this task, what is the correct status_code?
    task = task_api.find_by_id(db, task_id, current_user.id)
    if not task:
        raise TaskException.raise404(task_id)
    return task


@router.post(
    "",
    response_model=task_model.TaskRead,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    *,
    db: Session = Depends(get_db),
    task: task_model.TaskCreate,
    current_user=Depends(auth_api.get_current_user),
):
    return task_api.create_task(db, task, current_user)


@router.patch(
    "/{task_id}",
    response_model=task_model.TaskRead,
    status_code=status.HTTP_200_OK,
)
def update_task(
    *,
    db: Session = Depends(get_db),
    task_id: int,
    task: task_model.TaskUpdate,
    current_user=Depends(auth_api.get_current_user),
):
    origin = task_api.find_by_id(db, task_id, current_user.id)
    if not origin:
        raise TaskException.raise404(task_id)
    return task_api.update_task(db, origin, task)


@router.post(
    "/{task_id}/done",
    response_model=task_model.TaskRead,
    status_code=status.HTTP_200_OK,
)
def done_task(
    *,
    db: Session = Depends(get_db),
    task_id: int,
    current_user=Depends(auth_api.get_current_user),
):
    task = task_api.find_by_id(db, task_id, current_user.id)
    if not task:
        raise TaskException.raise404(task_id)
    return task_api.done_task(db, task)


@router.post(
    "/{task_id}/undone",
    response_model=task_model.TaskRead,
    status_code=status.HTTP_200_OK,
)
def undone_task(
    *,
    db: Session = Depends(get_db),
    task_id: int,
    current_user=Depends(auth_api.get_current_user),
):
    # TODO: duplicate? or toggle_done?
    task = task_api.find_by_id(db, task_id, current_user.id)
    if not task:
        raise TaskException.raise404(task_id)
    return task_api.undone_task(db, task)


@router.delete("/{task_id}", response_model=None, status_code=status.HTTP_200_OK)
def delete_task(
    *,
    db: Session = Depends(get_db),
    task_id: int,
    current_user=Depends(auth_api.get_current_user),
):
    task = task_api.find_by_id(db, task_id, current_user.id)
    if not task:
        raise TaskException.raise404(task_id)
    return task_api.delete_task(db, task)
