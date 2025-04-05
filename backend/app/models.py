from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None


class Todo(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: datetime
