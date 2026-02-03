import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreServicioComponent } from './pre-servicio/pre-servicio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PreServicioComponent],
  template: `<app-pre-servicio />`,
})
export class AppComponent {}
