import React from "react";
import { Todo, toggleTodo, deleteTodo } from "../lib/api";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Trash2, Edit } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onEdit, onToggle, onDelete }: TodoItemProps) {
  const handleToggle = async () => {
    try {
      await toggleTodo(todo.id);
      onToggle(todo);
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
      onDelete(todo.id);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-md mb-2 bg-white dark:bg-zinc-950 dark:border-zinc-800">
      <div className="flex items-center gap-3">
        <Checkbox 
          checked={todo.completed} 
          onCheckedChange={handleToggle}
          id={`todo-${todo.id}`}
        />
        <div className="flex flex-col">
          <label 
            htmlFor={`todo-${todo.id}`}
            className={`text-sm font-medium ${todo.completed ? 'line-through text-zinc-500' : ''}`}
          >
            {todo.title}
          </label>
          {todo.description && (
            <p className={`text-xs text-zinc-500 ${todo.completed ? 'line-through' : ''}`}>
              {todo.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onEdit(todo)}
          aria-label="Edit todo"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDelete}
          aria-label="Delete todo"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
