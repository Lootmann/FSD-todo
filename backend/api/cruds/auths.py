from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlmodel import Session

from api.cruds import users as user_api
from api.db import get_db
from api.models import auths as auth_model
from api.models import users as user_model
from api.settings import Settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oath2_scheme = OAuth2PasswordBearer(tokenUrl="token")
credential = Settings()


def get_hashed_password(plain_password: str) -> str:
    # NOTE: it takes 1 sec~. pretty slow
    return pwd_context.hash(plain_password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oath2_scheme)
) -> user_model.User:
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"www-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token, credential.secret_key, algorithms=[credential.algorithm]
        )
        username: str = payload.get("sub", None)

        if username is None:
            raise credential_exception

        token = auth_model.Token(username=username)
    except JWTError:
        raise credential_exception

    user = user_api.find_by_name(db, token.username)

    if user is None:
        raise credential_exception

    return user


def get_current_active_user(
    current_user: user_model.User = Depends(get_current_user),
):
    # TODO: definition active user
    return current_user


def create_access_token(data: dict, expired_delta: timedelta | None = None):
    if expired_delta:
        expire = datetime.utcnow() + expired_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    data.update({"exp": expire})
    encoded_jwt = jwt.encode(
        data, credential.secret_key, algorithm=credential.algorithm
    )

    return encoded_jwt


def authenticate_user(
    db: Session, username: str, password: str
) -> user_model.User | None:
    user = user_api.find_by_name(db, username)

    if not user or not verify_password(plain=password, hashed=user.password):
        return None

    return user
