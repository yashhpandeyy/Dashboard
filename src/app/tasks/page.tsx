'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils';


type RepeatType = 'daily' | 'weekly' | 'monthly' | 'none';
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type Month = 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december';

interface RepeatOptions {
  type: RepeatType;
  days?: DayOfWeek[]; // For weekly repeats
  dayOfMonth?: number; // For monthly repeats
  month?: Month; // For monthly repeats
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
  repeat: RepeatOptions;
}

const weekdays: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const months: Month[] = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const currentMonthName = months[new Date().getMonth()];


export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // State for the repeat functionality in the detail view
  const [repeatType, setRepeatType] = useState<RepeatType>('none');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState<number | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<Month>(currentMonthName);


  const daysInSelectedMonth = useMemo(() => {
    if (!selectedMonth) return [];
    const monthIndex = months.indexOf(selectedMonth);
    const year = new Date().getFullYear();
    const days = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }, [selectedMonth]);


  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() !== '') {
      setTasks([
        ...tasks,
        { id: Date.now(), text: newTaskText, completed: false, repeat: { type: 'none' } },
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
    setRepeatType(task.repeat.type);
    setSelectedDays(task.repeat.days || []);
    setSelectedDayOfMonth(task.repeat.dayOfMonth);
    setSelectedMonth(task.repeat.month || currentMonthName);
  };

  const handleBackToList = () => {
    setSelectedTaskId(null);
  };
  
  const handleSaveRepeat = () => {
    if (selectedTaskId !== null) {
      setTasks(tasks.map(task => {
        if (task.id === selectedTaskId) {
          const newRepeat: RepeatOptions = { type: repeatType };
          if (repeatType === 'weekly') {
            newRepeat.days = selectedDays;
          }
          if (repeatType === 'monthly') {
            newRepeat.dayOfMonth = selectedDayOfMonth;
            newRepeat.month = selectedMonth;
          }
          return { ...task, repeat: newRepeat };
        }
        return task;
      }));
      handleBackToList();
    }
  };

  const handleDaySelection = (day: DayOfWeek) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

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
          <p className="text-muted-foreground mb-6">Set recurrence for this task.</p>
          
          <div className="space-y-6">
            <RadioGroup value={repeatType} onValueChange={(value) => setRepeatType(value as RepeatType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Weekly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly</Label>
              </div>
            </RadioGroup>

            {repeatType === 'weekly' && (
              <Card className="p-4 bg-background/50">
                <h4 className="font-medium mb-3">Repeat on</h4>
                <div className="grid grid-cols-4 gap-2">
                    {weekdays.map(day => (
                        <Button 
                            key={day} 
                            variant={selectedDays.includes(day) ? 'secondary' : 'ghost'}
                            onClick={() => handleDaySelection(day)}
                            className="capitalize"
                        >
                            {day.substring(0,3)}
                        </Button>
                    ))}
                </div>
              </Card>
            )}

            {repeatType === 'monthly' && (
              <Card className="p-4 bg-background/50 space-y-4">
                 <Select onValueChange={(value) => setSelectedMonth(value as Month)} value={selectedMonth}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a month to repeat on" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map(month => (
                            <SelectItem key={month} value={month} className="capitalize">
                                {month}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="grid grid-cols-7 gap-1">
                  {daysInSelectedMonth.map(day => (
                    <Button
                      key={day}
                      variant={selectedDayOfMonth === day ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setSelectedDayOfMonth(day)}
                      className="h-9 w-9"
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </Card>
            )}


            <Button onClick={handleSaveRepeat} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Repeat Settings
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
