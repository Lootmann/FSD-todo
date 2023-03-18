from typing import Optional

from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    name: str = Field(index=True, min_length=5, max_length=100)


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    # NOTE: good password length is longer than 14!
    password: str = Field(min_length=8, max_length=100)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=100)


class UserRead(UserBase):
    id: int


class UserUpdate(UserBase):
    password: str = Field(default=None, min_length=8, max_length=100)
