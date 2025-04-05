
export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
}

export interface TodoCreate {
  title: string;
  description?: string;
}

const API_URL = 'http://localhost:8000';

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_URL}/api/todos`);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
}

export async function fetchTodo(id: number): Promise<Todo> {
  const response = await fetch(`${API_URL}/api/todos/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch todo');
  }
  return response.json();
}

export async function createTodo(todo: TodoCreate): Promise<Todo> {
  const response = await fetch(`${API_URL}/api/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  return response.json();
}

export async function updateTodo(id: number, todo: TodoCreate): Promise<Todo> {
  const response = await fetch(`${API_URL}/api/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  if (!response.ok) {
    throw new Error('Failed to update todo');
  }
  return response.json();
}

export async function toggleTodo(id: number): Promise<Todo> {
  const response = await fetch(`${API_URL}/api/todos/${id}/toggle`, {
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error('Failed to toggle todo');
  }
  return response.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
}
