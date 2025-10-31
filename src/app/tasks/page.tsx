'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ArrowLeft, Repeat, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils';
import { SaveButton } from '@/components/ui/save-button';


type RepeatType = 'daily' | 'weekly' | 'monthly' | 'none';
type DayOfWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

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

const weekdays: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const months: Month[] = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const currentMonthName = months[new Date().getMonth()];

const getRepeatSummary = (repeat: RepeatOptions) => {
    switch (repeat.type) {
        case 'daily':
            return 'Daily';
        case 'weekly':
            if (!repeat.days || repeat.days.length === 0) return 'Weekly';
            if (repeat.days.length === 7) return 'Everyday';
            if (repeat.days.length === 1) return repeat.days[0].charAt(0).toUpperCase() + repeat.days[0].slice(1);
            
            const dayIndexes = repeat.days.map(d => weekdays.indexOf(d)).sort((a,b) => a - b);
            let isConsecutive = true;
            for(let i=0; i< dayIndexes.length - 1; i++) {
                if(dayIndexes[i+1] !== dayIndexes[i] + 1) {
                    isConsecutive = false;
                    break;
                }
            }
            if(isConsecutive && dayIndexes.length > 2) {
                const startDay = weekdays[dayIndexes[0]].substring(0,3);
                const endDay = weekdays[dayIndexes[dayIndexes.length - 1]].substring(0,3);
                return `${startDay}-${endDay}`;
            }

            return repeat.days.map(d => d.substring(0,3)).join(', ');

        case 'monthly':
            if (repeat.month && repeat.dayOfMonth) {
                return `${repeat.month.substring(0,3)} ${repeat.dayOfMonth}`;
            }
            return 'Monthly';
        case 'none':
             return 'None';
        default:
            return null;
    }
}


export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Temporary state for the detail view while editing
  const [editingRepeat, setEditingRepeat] = useState<RepeatOptions | null>(null);
  const [isSaved, setIsSaved] = useState(true);

  const daysInSelectedMonth = useMemo(() => {
    if (!editingRepeat || editingRepeat.type !== 'monthly' || !editingRepeat.month) return [];
    const monthIndex = months.indexOf(editingRepeat.month);
    const year = new Date().getFullYear();
    const days = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }, [editingRepeat]);


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
    // Create a deep copy for editing to avoid mutating state directly
    setEditingRepeat(JSON.parse(JSON.stringify(task.repeat)));
    setIsSaved(true);
  };
  
  const handleSaveChanges = () => {
    if (selectedTaskId && editingRepeat) {
      setTasks(tasks.map(task => 
        task.id === selectedTaskId ? { ...task, repeat: editingRepeat } : task
      ));
    }
    setIsSaved(true);
  }

  const handleBackToList = () => {
    if (!isSaved) {
       handleSaveChanges();
    }
    setSelectedTaskId(null);
    setEditingRepeat(null);
  };
  
  const handleDaySelection = (day: DayOfWeek) => {
    if (!editingRepeat) return;
    setIsSaved(false);
    const currentDays = editingRepeat.days || [];
    const newSelectedDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    setEditingRepeat({
        ...editingRepeat,
        type: 'weekly',
        days: newSelectedDays
    });
  };

  const handleDayOfMonthSelection = (day: number) => {
      if (!editingRepeat) return;
      setIsSaved(false);
      setEditingRepeat({
          ...editingRepeat,
          type: 'monthly',
          dayOfMonth: day
      });
  }
  
  const handleMonthSelection = (month: Month) => {
    if (!editingRepeat) return;
    setIsSaved(false);
    setEditingRepeat({
      ...editingRepeat,
      month: month,
      // Reset day if it's invalid for the new month
      dayOfMonth: editingRepeat.dayOfMonth
    });
  }

  const handleRepeatTypeChange = (value: RepeatType) => {
    if(!editingRepeat) return;
    setIsSaved(false);
    const newRepeat: RepeatOptions = { type: value };
    if (value === 'monthly') {
      newRepeat.month = currentMonthName;
    }
    setEditingRepeat(newRepeat);
  }


  const selectedTask = tasks.find(task => task.id === selectedTaskId);

  if (selectedTask && editingRepeat) {
    const showWeeklySelector = editingRepeat.type === 'weekly';
    const showMonthlySelector = editingRepeat.type === 'monthly';

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="h-5 w-5 text-muted-foreground" />
                <Label className="text-base font-medium">Repeat</Label>
              </div>
              <div className="flex items-center gap-4">
                 {isSaved && <span className="text-sm text-muted-foreground">{getRepeatSummary(editingRepeat)}</span>}
                 <Select value={editingRepeat.type} onValueChange={(value) => handleRepeatTypeChange(value as RepeatType)}>
                    <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>

            {!isSaved && (
              <>
                {showWeeklySelector && (
                  <Card className="p-4 bg-background/50">
                    <div className="flex justify-between items-center">
                        {weekdays.map(day => (
                            <button
                                key={day} 
                                onClick={() => handleDaySelection(day)}
                                className={cn(
                                    "flex items-center justify-center h-9 w-9 rounded-full border-2 transition-colors",
                                    editingRepeat.days?.includes(day) 
                                        ? "border-primary bg-primary/10 text-primary" 
                                        : "border-transparent hover:bg-secondary"
                                )}
                            >
                                <span className="text-sm font-medium">{day.substring(0,1).toUpperCase()}</span>
                            </button>
                        ))}
                    </div>
                  </Card>
                )}

                {showMonthlySelector && (
                  <Card className="p-4 bg-background/50 space-y-4">
                    <Select onValueChange={(value) => handleMonthSelection(value as Month)} value={editingRepeat.month}>
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
                          variant={editingRepeat.dayOfMonth === day ? 'secondary' : 'ghost'}
                          size="icon"
                          onClick={() => handleDayOfMonthSelection(day)}
                          className="h-9 w-9"
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </Card>
                )}
                <SaveButton onSave={handleSaveChanges} />
              </>
            )}

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
                      <div className='flex-grow'>
                        <label
                          htmlFor={`task-${task.id}`}
                          className={cn(
                            'text-base cursor-pointer',
                            task.completed ? 'text-muted-foreground line-through' : ''
                          )}
                        >
                          {task.text}
                        </label>
                        {task.repeat.type !== 'none' && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                <Repeat className="h-3 w-3" />
                                <span>{getRepeatSummary(task.repeat)}</span>
                            </div>
                        )}
                      </div>
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
