import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PricingBreakdown, PreServicioSelection } from './models';

@Component({
  selector: 'app-summary-sticky',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
  <aside class="summary">
    <div class="header">
      <div>
        <div class="title">Resumen de compra</div>
        <div class="sub">
          Vehículo: <b>{{ selection?.vehicle }}</b> · Pago: <b>{{ selection?.paymentMethod }}</b>
        </div>
      </div>
      <div class="total">{{ breakdown?.total | currency:'MXN':'symbol':'1.2-2' }}</div>
    </div>

    <div class="lines" *ngIf="breakdown">
      <div class="line" *ngFor="let l of breakdown.lines">
        <span>{{ l.label }}</span>
        <span>{{ l.amount | currency:'MXN':'symbol':'1.2-2' }}</span>
      </div>
    </div>

    <div class="divider"></div>

    <button class="btnSecondary" type="button" (click)="scrollTop()">
      Editar selección
    </button>
  </aside>
  `,
  styles: [`
    .summary{
      background:#fff;
      border:1px solid #e6edf5;
      border-radius:16px;
      box-shadow: 0 8px 24px rgba(0,0,0,.08);
      padding:14px;
    }
    .header{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
    .title{font-weight:1000}
    .sub{font-size:12px;color:#7a8797;font-weight:800;margin-top:4px}
    .total{
      font-weight:1100;
      font-size:18px;
      padding:8px 10px;
      border-radius:12px;
      background:#f2f6ff;
      border:1px solid #e8f0ff;
      white-space:nowrap;
    }
    .lines{margin-top:12px}
    .line{display:flex;justify-content:space-between;gap:10px;font-weight:900;font-size:13px;padding:8px 0}
    .divider{height:1px;background:#e6edf5;margin:10px 0}
    .btnSecondary{
      width:100%;
      border:1px solid #e6edf5;
      border-radius:14px;
      padding:12px 14px;
      background:#fff;
      font-weight:1000;
      cursor:pointer;
    }
  `]
})
export class SummaryStickyComponent {
  @Input({ required: true }) selection!: PreServicioSelection;
  @Input({ required: true }) breakdown!: PricingBreakdown;

  scrollTop(){ window.scrollTo({ top: 0, behavior: 'smooth' }); }
}
