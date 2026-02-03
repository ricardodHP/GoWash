import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingService } from './pricing.service';
import { AddonId, PackageId, VehicleType } from './models';
import { SummaryStickyComponent } from './summary-sticky.component';

@Component({
  selector: 'app-pre-servicio',
  standalone: true,
  imports: [CommonModule, SummaryStickyComponent],
  template: `
    <section class="shell">
      <div class="config">
        <h2>Pre-servicio</h2>
        <p class="muted">Selecciona tu vehículo y el paquete antes de llegar.</p>
        <div class="block">
          <label>Vehículo</label>
          <div class="choices">
            <button
              type="button"
              *ngFor="let vehicle of vehicles; trackBy: trackVehicle"
              [class.selected]="vehicleType() === vehicle.type"
              (click)="vehicleType.set(vehicle.type)">
              {{ vehicle.label }}
            </button>
          </div>
        </div>
        <div class="block">
          <label>Paquete</label>
          <select [value]="pkg()" (change)="pkg.set($any($event.target).value)">
            <option *ngFor="let item of packages" [value]="item.id">{{ item.label }}</option>
          </select>
        </div>
        <div class="block">
          <label>Extras activos</label>
          <div class="choices">
            <button
              type="button"
              *ngFor="let item of addons; trackBy: trackAddon"
              [class.selected]="enabled(item.id)"
              (click)="toggleAddon(item.id)">
              {{ item.label }}
            </button>
          </div>
        </div>
      </div>
      <app-summary-sticky
        [vehicleLabel]="vehicleLabel()"
        [packageLabel]="packageLabel()"
        [durationMinutes]="durationMinutes()"
        [total]="total()"></app-summary-sticky>
    </section>
  `,
  styles: [
    `
      .shell {
        display: grid;
        gap: 24px;
        grid-template-columns: 1fr;
      }
      .config {
        background: #ffffff;
        border-radius: 16px;
        padding: 20px;
        border: 1px solid #e6edf5;
      }
      .block {
        margin-top: 16px;
      }
      .muted {
        color: #7a8797;
      }
      .choices {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      button {
        border-radius: 12px;
        border: 1px solid #e6edf5;
        padding: 8px 12px;
        background: #fff;
        cursor: pointer;
      }
      button.selected {
        border-color: #2f7df6;
        color: #2f7df6;
        font-weight: 700;
      }
      select {
        width: 100%;
        padding: 10px;
        border-radius: 12px;
        border: 1px solid #e6edf5;
      }
      @media (min-width: 960px) {
        .shell {
          grid-template-columns: minmax(0, 1fr) 320px;
        }
      }
    `,
  ],
})
export class PreServicioComponent {
  readonly packages = this.pricing.getPackages();
  readonly vehicles = this.pricing.getVehicles();
  readonly addons = this.pricing.getAddons();

  vehicleType = signal<VehicleType>('chico');
  pkg = signal<PackageId>('completo');
  addonSelection = signal<Record<AddonId, boolean>>({
    aroma_corcho: false,
    bolsa_basura: false,
    cera_lujo: false,
    par_tapetes: false,
    corcho: false,
    ecoloco: false,
    extra_lodo: false,
    extra_sucio: false,
  });

  vehicleLabel = computed(() => {
    return this.vehicles.find((item) => item.type === this.vehicleType())?.label ?? '';
  });

  packageLabel = computed(() => {
    return this.packages.find((item) => item.id === this.pkg())?.label ?? '';
  });

  durationMinutes = computed(() => this.pricing.durationMinutes(this.pkg()));

  total = computed(() => {
    const base = this.pricing.basePrice(this.pkg(), this.vehicleType());
    const extras = this.addons
      .filter((addon) => this.enabled(addon.id))
      .reduce((acc, addon) => acc + addon.price, 0);
    return Math.round((base + extras) * 100) / 100;
  });

  constructor(private readonly pricing: PricingService) {}

  enabled(id: AddonId): boolean {
    return this.addonSelection()[id];
  }

  toggleAddon(id: AddonId): void {
    const current = this.addonSelection();
    this.addonSelection.set({ ...current, [id]: !current[id] });
  }

  trackVehicle(_index: number, vehicle: { type: VehicleType }): VehicleType {
    return vehicle.type;
  }

  trackAddon(_index: number, addon: { id: AddonId }): AddonId {
    return addon.id;
  }
}
