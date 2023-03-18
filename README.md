# FastAPI + SQLModel + PostgresSQL Todo

SQLModel + Docker Compose を利用した適当なTodoアプリ


## Models

```python
class Project:
  id: int
  sections: List[Section]


class Section:
  id: int
  tasks: List[Task]


class Task:
  id: int
  priority: int
  created_at: datetime
  updated_at: datetime
  expired_at: datetime
  is_done: bool
  project: Project

class User:
  id: int
  name: str
  password: str
```


## Features

- task
  - search
    - find_by_name
