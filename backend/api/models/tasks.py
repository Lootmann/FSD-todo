from datetime import date
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from api.models.users import User


class TaskBase(SQLModel):
    title: str = Field(default="")
    description: str = Field(default="")
    priority: int = Field(default=0, ge=0, le=3)
    created_at: date = Field(default=date.today())
    updated_at: date = Field(default=date.today())
    expired_at: Optional[date] = Field(default=None)
    is_done: bool = Field(default=False)


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    user: Optional["User"] = Relationship(back_populates="tasks")


class TaskCreate(TaskBase):
    pass


class TaskRead(TaskBase):
    id: int


class TaskUpdate(TaskBase):
    title: Optional[str] = None
    comment: Optional[str] = None
    priority: Optional[int] = Field(default=None, ge=0, le=3)
    expired_at: Optional[date] = None
