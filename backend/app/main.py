from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime
import uuid

from .models import Todo, TodoCreate

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

todos = []
todo_id_counter = 1

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.post("/api/todos", response_model=Todo)
async def create_todo(todo: TodoCreate):
    global todo_id_counter
    new_todo = Todo(
        id=todo_id_counter,
        title=todo.title,
        description=todo.description,
        completed=False,
        created_at=datetime.now()
    )
    todos.append(new_todo)
    todo_id_counter += 1
    return new_todo

@app.get("/api/todos", response_model=List[Todo])
async def get_todos():
    return todos

@app.get("/api/todos/{todo_id}", response_model=Todo)
async def get_todo(todo_id: int):
    for todo in todos:
        if todo.id == todo_id:
            return todo
    raise HTTPException(status_code=404, detail="Todo not found")

@app.put("/api/todos/{todo_id}", response_model=Todo)
async def update_todo(todo_id: int, todo_update: TodoCreate):
    for i, todo in enumerate(todos):
        if todo.id == todo_id:
            todos[i].title = todo_update.title
            todos[i].description = todo_update.description
            return todos[i]
    raise HTTPException(status_code=404, detail="Todo not found")

@app.put("/api/todos/{todo_id}/toggle", response_model=Todo)
async def toggle_todo(todo_id: int):
    for i, todo in enumerate(todos):
        if todo.id == todo_id:
            todos[i].completed = not todos[i].completed
            return todos[i]
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/api/todos/{todo_id}")
async def delete_todo(todo_id: int):
    for i, todo in enumerate(todos):
        if todo.id == todo_id:
            deleted_todo = todos.pop(i)
            return {"message": "Todo deleted successfully"}
    raise HTTPException(status_code=404, detail="Todo not found")
