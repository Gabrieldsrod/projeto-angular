import { Injectable } from '@angular/core';
import { Task, MOCK_TASKS } from './task.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = [...MOCK_TASKS];
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);

  getTasks(category?: string | null): Observable<Task[]> {
    return this.tasksSubject.asObservable().pipe(
      map(tasks => category ? tasks.filter(t => t.category.toLowerCase() === category.toLowerCase()) : tasks)
    );
  }

  addTask(title: string, category: 'Trabalho' | 'Pessoal') {
    const newTask: Task = {
      id: Date.now(),
      title,
      category,
      completed: false
    };
    this.tasks = [...this.tasks, newTask];
    this.tasksSubject.next(this.tasks);
  }

  updateTask(updatedTask: Task) {
    this.tasks = this.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    this.tasksSubject.next(this.tasks);
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.tasksSubject.next(this.tasks);
  }
  
  toggleTaskCompletion(id: number) {
    this.tasks = this.tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this.tasksSubject.next(this.tasks);
  }
}
