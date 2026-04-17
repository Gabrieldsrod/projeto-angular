import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from './task.service';
import { Task } from './task.model';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Minhas Tarefas</h1>
      
      <!-- Formulário para adicionar nova tarefa -->
      <form (ngSubmit)="addTask()" class="flex flex-col sm:flex-row gap-3 mb-6 bg-gray-50 p-4 rounded-lg border">
        <input type="text" [(ngModel)]="newTaskTitle" name="title" placeholder="Nova tarefa..." required
               class="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
        <select [(ngModel)]="newTaskCategory" name="category" 
                class="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="Trabalho">Trabalho</option>
          <option value="Pessoal">Pessoal</option>
        </select>
        <button type="submit" [disabled]="!newTaskTitle.trim()"
                class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50">
          Adicionar
        </button>
      </form>

      <!-- Filtros -->
      <div class="flex gap-4 mb-6 border-b pb-4">
        <a routerLink="/" routerLinkActive="font-bold border-b-2 border-gray-800" [routerLinkActiveOptions]="{exact: true}" class="px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t transition">Todas</a>
        <a routerLink="/trabalho" routerLinkActive="font-bold border-b-2 border-blue-600" class="px-4 py-2 text-blue-800 hover:bg-blue-50 rounded-t transition">Trabalho</a>
        <a routerLink="/pessoal" routerLinkActive="font-bold border-b-2 border-green-600" class="px-4 py-2 text-green-800 hover:bg-green-50 rounded-t transition">Pessoal</a>
      </div>

      <!-- Lista de tarefas -->
      <ul class="space-y-3">
        <li *ngFor="let task of tasks$ | async" 
            class="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:shadow-sm transition gap-3"
            [ngClass]="{'bg-gray-50': task.completed, 'bg-white': !task.completed}">
          
          <!-- Modo Visualização/Edição -->
          <div class="flex items-center gap-3 flex-1">
            <input type="checkbox" [checked]="task.completed" (change)="toggleCompletion(task.id)" 
                   class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer">
            
            <div *ngIf="editingTaskId !== task.id; else editMode" class="flex-1">
              <span [ngClass]="{'line-through text-gray-400': task.completed, 'text-gray-700': !task.completed}" class="font-medium mr-2">
                {{ task.title }}
              </span>
              <span class="px-3 py-1 text-xs font-semibold rounded-full inline-block mt-1 sm:mt-0"
                    [ngClass]="task.category === 'Trabalho' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
                {{ task.category }}
              </span>
            </div>
            
            <ng-template #editMode>
              <div class="flex-1 flex flex-col sm:flex-row gap-2">
                <input type="text" [(ngModel)]="editTaskTitle" class="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <select [(ngModel)]="editTaskCategory" class="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Trabalho">Trabalho</option>
                  <option value="Pessoal">Pessoal</option>
                </select>
                <div class="flex gap-2">
                  <button (click)="saveEdit(task)" class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex-1 sm:flex-none">Salvar</button>
                  <button (click)="cancelEdit()" class="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm flex-1 sm:flex-none">Cancelar</button>
                </div>
              </div>
            </ng-template>
          </div>

          <!-- Ações -->
          <div class="flex items-center gap-2 justify-end sm:justify-start" *ngIf="editingTaskId !== task.id">
            <button (click)="startEdit(task)" class="p-2 text-blue-600 hover:bg-blue-50 rounded transition" title="Editar">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button (click)="deleteTask(task.id)" class="p-2 text-red-600 hover:bg-red-50 rounded transition" title="Remover">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

        </li>
        <li *ngIf="(tasks$ | async)?.length === 0" class="text-center text-gray-500 py-8 bg-gray-50 rounded-lg border border-dashed">
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
    switchMap(params => this.taskService.getTasks(params.get('category')))
  );

  newTaskTitle = '';
  newTaskCategory: 'Trabalho' | 'Pessoal' = 'Trabalho';

  editingTaskId: number | null = null;
  editTaskTitle = '';
  editTaskCategory: 'Trabalho' | 'Pessoal' = 'Trabalho';

  addTask() {
    if (this.newTaskTitle.trim()) {
      this.taskService.addTask(this.newTaskTitle.trim(), this.newTaskCategory);
      this.newTaskTitle = '';
    }
  }

  toggleCompletion(id: number) {
    this.taskService.toggleTaskCompletion(id);
  }

  deleteTask(id: number) {
    if (confirm('Tem certeza que deseja remover esta tarefa?')) {
      this.taskService.deleteTask(id);
    }
  }

  startEdit(task: Task) {
    this.editingTaskId = task.id;
    this.editTaskTitle = task.title;
    this.editTaskCategory = task.category;
  }

  cancelEdit() {
    this.editingTaskId = null;
  }

  saveEdit(task: Task) {
    if (this.editTaskTitle.trim()) {
      this.taskService.updateTask({
        ...task,
        title: this.editTaskTitle.trim(),
        category: this.editTaskCategory
      });
      this.editingTaskId = null;
    }
  }
}
