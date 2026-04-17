import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `<div class="min-h-screen bg-gray-100 py-10"><router-outlet></router-outlet></div>`
})
export class AppComponent {}
