'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  description: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [description, setDescription] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() !== '') {
      setTasks([
        ...tasks,
        { id: Date.now(), text: newTaskText, completed: false, description: '' },
      ]);
      setNewTaskText('');
    }
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleCardClick = (task: Task) => {
    setSelectedTaskId(task.id);
    setDescription(task.description);
  };

  const handleBackToList = () => {
    setSelectedTaskId(null);
    setDescription('');
  };
  
  const handleSaveDescription = () => {
    if (selectedTaskId !== null) {
      setTasks(tasks.map(task => 
        task.id === selectedTaskId ? { ...task, description: description } : task
      ));
      handleBackToList();
    }
  };

  const selectedTask = tasks.find(task => task.id === selectedTaskId);

  if (selectedTask) {
    return (
      <main className="p-8 md:p-12">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={handleBackToList} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tasks
          </Button>
          <h1 className="text-3xl font-bold mb-2">{selectedTask.text}</h1>
          <p className="text-muted-foreground mb-6">Add a description for your task.</p>
          
          <div className="space-y-4">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add your description here..."
              className="min-h-[200px] bg-background"
            />
            <Button onClick={handleSaveDescription} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Description
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="p-8 md:p-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-left">Tasks</h1>

        <form onSubmit={handleAddTask} className="flex items-center gap-2 mb-8">
          <Input
            type="text"
            value={newTaskText}
            onChange={e => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow bg-background"
          />
          <Button type="submit" size="icon">
            <Plus className="h-5 w-5" />
            <span className="sr-only">Add Task</span>
          </Button>
        </form>

        <ScrollArea className="h-[calc(100vh-250px)] pr-4">
          <div className="space-y-3">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <Card
                  key={task.id}
                  onClick={() => handleCardClick(task)}
                  className="bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                    <div className="flex items-center gap-4 p-4">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`flex-grow text-base cursor-pointer ${
                          task.completed ? 'text-muted-foreground line-through' : ''
                        }`}
                      >
                        {task.text}
                      </label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Task</span>
                      </Button>
                    </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 px-4 rounded-lg bg-secondary/30">
                <p className="text-muted-foreground">Your task list is empty.</p>
                <p className="text-sm text-muted-foreground/70">Add a task to get started!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}
