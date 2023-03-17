from sqlmodel import SQLModel


class Token(SQLModel):
    username: str


class TokenData(SQLModel):
    access_token: str
    token_type: str
