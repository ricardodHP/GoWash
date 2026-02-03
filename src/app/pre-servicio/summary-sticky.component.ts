import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PackageId, PreServicioSelection, PricingBreakdown, VehicleType } from './models';

@Component({
  selector: 'app-summary-sticky',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  template: `
    <aside class="summary">
      <div class="header">
        <div>
          <h3>Resumen</h3>
          <p class="muted">{{ vehicleLabel }} · {{ packageLabel }}</p>
        </div>
        <div class="price">{{ breakdown?.total ?? 0 | currency: 'MXN':'symbol':'1.2-2' }}</div>
      </div>
      <div class="details">
        <p>Duración estimada: <strong>{{ durationMinutes }} min</strong></p>
      </div>
    </aside>
  `,
  styles: [
    `
      .summary {
        background: #fff;
        border-radius: 16px;
        border: 1px solid #e6edf5;
        padding: 16px;
        position: sticky;
        top: 16px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
      }
      .price {
        background: #f2f6ff;
        border-radius: 12px;
        padding: 8px 12px;
        font-weight: 700;
      }
      .muted {
        color: #7a8797;
        margin: 4px 0 0;
      }
      h3 {
        margin: 0;
      }
    `,
  ],
})
export class SummaryStickyComponent {
  @Input({ required: true }) selection!: PreServicioSelection;
  @Input({ required: true }) breakdown!: PricingBreakdown;

  private vehicleLabels: Record<VehicleType, string> = {
    chico: 'Chico',
    mediano: 'Mediano',
    grande: 'Grande',
    extra: 'Extra grande',
  };

  private packageLabels: Record<PackageId, string> = {
    completo: 'Servicio completo',
    exterior: 'Lavado exterior',
    aspirado: 'Aspirado',
    premium: 'Premium',
  };

  get vehicleLabel(): string {
    return this.vehicleLabels[this.selection?.vehicle] ?? '';
  }

  get packageLabel(): string {
    return this.packageLabels[this.selection?.packageId] ?? '';
  }

  get durationMinutes(): number {
    return 0;
  }

  scrollTop(){ window.scrollTo({ top: 0, behavior: 'smooth' }); }
}
