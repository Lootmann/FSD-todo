import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from api.models.users import User


class TaskBase(SQLModel):
    comment: str = Field(default="")
    priority: int = Field(default=0)
    created_at: datetime.date = Field(default=datetime.date)
    updated_at: datetime.date = Field(default=datetime.date)
    expired_at: Optional[datetime.date] = Field(default=None)
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
    id: int
