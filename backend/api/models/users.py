from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from api.models.tasks import Task


class UserBase(SQLModel):
    username: str = Field(index=True, min_length=5, max_length=100)


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    # NOTE: good password length is longer than 14!
    password: str = Field(min_length=8, max_length=100)

    tasks: List["Task"] = Relationship(back_populates="user")


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=100)


class UserRead(UserBase):
    id: int


class UserUpdate(UserBase):
    username: Optional[str] = Field(default=None, min_length=5, max_length=100)
    password: Optional[str] = Field(default=None, min_length=8, max_length=100)
