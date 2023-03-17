from typing import Optional

from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    name: str = Field(index=True)


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password: str


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int


class UserUpdate(UserBase):
    name: str
    password: str
