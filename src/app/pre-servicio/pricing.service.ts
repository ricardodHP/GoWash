import { Injectable } from '@angular/core';
import { Addon, PackageConfig, PackageId, SummaryLine, VehicleConfig, VehicleType } from './models';

@Injectable({ providedIn: 'root' })
export class PricingService {
  private readonly packages: PackageConfig[] = [
    { id: 'completo', label: 'Servicio completo', basePrice: 83, durationMinutes: 60 },
    { id: 'exterior', label: 'Lavado exterior', basePrice: 65, durationMinutes: 30 },
    { id: 'aspirado', label: 'Lavado + aspirado', basePrice: 75, durationMinutes: 45 },
    { id: 'premium', label: 'Detallado premium', basePrice: 140, durationMinutes: 90 },
  ];

  private readonly vehicles: VehicleConfig[] = [
    { type: 'chico', label: 'Chico', factor: 1.0 },
    { type: 'mediano', label: 'Mediano', factor: 1.1 },
    { type: 'grande', label: 'Grande', factor: 1.25 },
    { type: 'extra', label: 'Extra grande', factor: 1.4 },
  ];

  private readonly addons: Addon[] = [
    { id: 'aroma_corcho', label: 'Aroma a corcho', price: 15, qtyEnabled: true, defaultQty: 1, section: 'adicional' },
    { id: 'bolsa_basura', label: 'Bolsa de basura', price: 15, qtyEnabled: true, defaultQty: 1, section: 'adicional' },
    { id: 'cera_lujo', label: 'Cera de lujo', price: 15, qtyEnabled: true, defaultQty: 1, section: 'adicional' },
    { id: 'par_tapetes', label: 'Par de Tapetes (2 unid)', price: 15, qtyEnabled: true, defaultQty: 1, section: 'adicional' },
    { id: 'corcho', label: 'Corcho', price: 15, qtyEnabled: true, defaultQty: 1, section: 'especial' },
    { id: 'ecoloco', label: 'Ecoloco', price: 15, qtyEnabled: true, defaultQty: 1, section: 'especial' },
    { id: 'extra_lodo', label: 'Extra lodo', price: 15, qtyEnabled: true, defaultQty: 1, section: 'especial' },
    { id: 'extra_sucio', label: 'Extra sucio', price: 15, qtyEnabled: true, defaultQty: 1, section: 'especial' },
  ];

  getPackages(): PackageConfig[] {
    return [...this.packages];
  }

  getVehicles(): VehicleConfig[] {
    return [...this.vehicles];
  }

  getAddons(): Addon[] {
    return [...this.addons];
  }

  basePrice(pkgId: PackageId, vehicleType: VehicleType): number {
    const pkg = this.packages.find((item) => item.id === pkgId);
    const vehicle = this.vehicles.find((item) => item.type === vehicleType);
    if (!pkg || !vehicle) {
      return 0;
    }
    return this.roundCurrency(pkg.basePrice * vehicle.factor);
  }

  durationMinutes(pkgId: PackageId): number {
    return this.packages.find((item) => item.id === pkgId)?.durationMinutes ?? 0;
  }

  buildSummaryLines(baseLabel: string, baseAmount: number, extras: SummaryLine[]): SummaryLine[] {
    return [{ label: baseLabel, amount: baseAmount }, ...extras];
  }

  totalFromLines(lines: SummaryLine[]): number {
    return this.roundCurrency(lines.reduce((acc, line) => acc + line.amount, 0));
  }

  private roundCurrency(amount: number): number {
    return Math.round(amount * 100) / 100;
  }
}
