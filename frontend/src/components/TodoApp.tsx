import React, { useState, useEffect } from "react";
import { Todo, TodoCreate, fetchTodos, createTodo, updateTodo, deleteTodo, toggleTodo } from "../lib/api";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";
import { Button } from "../components/ui/button";
import { PlusIcon } from "lucide-react";

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError("Failed to load todos. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (todoData: TodoCreate) => {
    try {
      const newTodo = await createTodo(todoData);
      setTodos([...todos, newTodo]);
      setShowForm(false);
    } catch (err) {
      setError("Failed to add todo. Please try again.");
      console.error(err);
    }
  };

  const handleUpdateTodo = async (todoData: TodoCreate) => {
    if (!editingTodo) return;
    
    try {
      const updatedTodo = await updateTodo(editingTodo.id, todoData);
      setTodos(todos.map(todo => 
        todo.id === editingTodo.id ? updatedTodo : todo
      ));
      setEditingTodo(null);
    } catch (err) {
      setError("Failed to update todo. Please try again.");
      console.error(err);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const updatedTodo = await toggleTodo(todo.id);
      setTodos(todos.map(t => 
        t.id === todo.id ? updatedTodo : t
      ));
    } catch (err) {
      setError("Failed to toggle todo status. Please try again.");
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError("Failed to delete todo. Please try again.");
      console.error(err);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Todo App</h1>
        {!showForm && !editingTodo && (
          <Button onClick={() => setShowForm(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Todo
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <TodoForm 
          onSubmit={handleAddTodo} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      {editingTodo && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Edit Todo</h2>
          <TodoForm 
            initialData={{
              title: editingTodo.title,
              description: editingTodo.description
            }}
            onSubmit={handleUpdateTodo}
            onCancel={() => setEditingTodo(null)}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading todos...</div>
      ) : todos.length === 0 ? (
        <div className="text-center py-8 text-zinc-500">
          No todos yet. Add one to get started!
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-medium mb-2">Your Todos</h2>
          <div className="space-y-2">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onEdit={handleEditTodo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
