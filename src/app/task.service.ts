import { Injectable } from '@angular/core';
import { Task, MOCK_TASKS } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = MOCK_TASKS;

  getTasks(category?: string | null): Task[] {
    if (category) {
      return this.tasks.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }
    return this.tasks;
  }
}
