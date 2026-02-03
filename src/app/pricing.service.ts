import { Injectable } from '@angular/core';
import {
  AddonCatalogItem,
  AddonId,
  PackageId,
  PreServicioSelection,
  PricingBreakdown,
  VehicleType,
} from './models';

@Injectable({ providedIn: 'root' })
export class PricingService {
  // ✅ precios por tipo de vehículo
  // Ajusta 'extra' cuando me confirmes (ej. 180).
  private vehicleBasePrice: Record<VehicleType, number> = {
    chico: 100,
    mediano: 120,
    grande: 150,
    extra: 150, // placeholder
  };

  // Por ahora un paquete. Si luego metes paquetes,
  // puedes hacer esto por packageId también.
  private packageMultiplier: Record<PackageId, number> = {
    completo: 1,
    exterior: 1,
    aspirado: 1,
    premium: 1,
  };

  // catálogo único de addons
  readonly catalog: AddonCatalogItem[] = [
    { id: 'aroma_corcho', label: 'Aroma a corcho', price: 15, section: 'adicional' },
    { id: 'bolsa_basura', label: 'Bolsa de basura', price: 15, section: 'adicional' },
    { id: 'cera_lujo', label: 'Cera de lujo', price: 15, section: 'adicional' },
    { id: 'par_tapetes', label: 'Par de Tapetes (2 unid)', price: 15, section: 'adicional' },

    { id: 'corcho', label: 'Corcho', price: 15, section: 'especial' },
    { id: 'ecoloco', label: 'Ecoloco', price: 15, section: 'especial' },
    { id: 'extra_lodo', label: 'Extra lodo', price: 15, section: 'especial' },
    { id: 'extra_sucio', label: 'Extra sucio', price: 15, section: 'especial' },
  ];

  getBasePrice(vehicle: VehicleType, pkg: PackageId): number {
    const base = this.vehicleBasePrice[vehicle] ?? 0;
    const mult = this.packageMultiplier[pkg] ?? 1;
    return this.round(base * mult);
  }

  getAddonLabel(id: AddonId): string {
    return this.catalog.find((x) => x.id === id)?.label ?? id;
  }

  getAddonUnitPrice(id: AddonId): number {
    return this.catalog.find((x) => x.id === id)?.price ?? 0;
  }

  getBreakdown(sel: PreServicioSelection): PricingBreakdown {
    const base = this.getBasePrice(sel.vehicle, sel.packageId);

    const lines = [{ key: 'base', label: 'Servicio base', amount: base }];

    let extras = 0;
    for (const a of sel.addons) {
      const unit = this.getAddonUnitPrice(a.id);
      const qty = Math.max(1, a.qty || 1);
      const subtotal = this.round(unit * qty);
      extras += subtotal;
      lines.push({
        key: `addon:${a.id}`,
        label: `${this.getAddonLabel(a.id)}${qty > 1 ? ` ×${qty}` : ''}`,
        amount: subtotal,
      });
    }

    const total = this.round(base + extras);
    return { base, extras: this.round(extras), total, lines };
  }

  private round(n: number): number {
    return Math.round(n * 100) / 100;
  }
}
