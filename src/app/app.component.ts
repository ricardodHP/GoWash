import { Component } from '@angular/core';
import { PreServicioComponent } from './pre-servicio/pre-servicio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PreServicioComponent],
  template: `<app-pre-servicio />`,
})
export class AppComponent {}
