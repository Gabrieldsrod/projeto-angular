import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from './task.service';
import { Task } from './task.model';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Minhas Tarefas</h1>
      
      <div class="flex gap-4 mb-6">
        <a routerLink="/" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 transition">Todas</a>
        <a routerLink="/trabalho" class="px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 transition">Trabalho</a>
        <a routerLink="/pessoal" class="px-4 py-2 rounded bg-green-100 hover:bg-green-200 text-green-800 transition">Pessoal</a>
      </div>

      <ul class="space-y-3">
        <li *ngFor="let task of tasks$ | async" 
            class="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition"
            [ngClass]="{'bg-gray-50': task.completed, 'bg-white': !task.completed}">
          <div class="flex items-center gap-3">
            <input type="checkbox" [checked]="task.completed" class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
            <span [ngClass]="{'line-through text-gray-400': task.completed, 'text-gray-700': !task.completed}" class="font-medium">
              {{ task.title }}
            </span>
          </div>
          <span class="px-3 py-1 text-xs font-semibold rounded-full"
                [ngClass]="task.category === 'Trabalho' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
            {{ task.category }}
          </span>
        </li>
        <li *ngIf="(tasks$ | async)?.length === 0" class="text-center text-gray-500 py-4">
          Nenhuma tarefa encontrada.
        </li>
      </ul>
    </div>
  `
})
export class TaskListComponent {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  tasks$: Observable<Task[]> = this.route.paramMap.pipe(
    map(params => params.get('category')),
    map(category => this.taskService.getTasks(category))
  );
}
