import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingService } from './pricing.service';
import { AddonId, PackageId, VehicleType } from './models';
import { SummaryStickyComponent } from './summary-sticky.component';
import { PayMethod, PreServicioSelection } from './models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pre-servicio',
  standalone: true,
  imports: [CommonModule, SummaryStickyComponent, FormsModule],
  templateUrl: './pre-servicio.component.html',
  styleUrl: './pre-servicio.component.css',
  providers: [PricingService],
})
export class PreServicioComponent {
  vehicle = signal<VehicleType>('chico');
    pkg = signal<PackageId>('completo');
    pay = signal<PayMethod>('efectivo');
    code = signal('');
  
    carDesc = '';
  
    details = {
      aspiradoCajuela: signal(true),
      aromatizante: signal(true),
      aroma: signal<'coco'|'canela'|'auto'|'brisa'>('canela'),
      armorTablero: signal(false),
      armorLlantas: signal(false),
    };
  
    // addons enabled + qty
    private enabledMap = signal<Record<AddonId, boolean>>({
      aroma_corcho:false, bolsa_basura:false, cera_lujo:false, par_tapetes:false,
      corcho:false, ecoloco:false, extra_lodo:false, extra_sucio:false
    });
  
    private qtyMap = signal<Record<AddonId, number>>({
      aroma_corcho:1, bolsa_basura:1, cera_lujo:1, par_tapetes:1,
      corcho:1, ecoloco:1, extra_lodo:1, extra_sucio:1
    });
  
    constructor(public pricing: PricingService) {}
  
    // derived payload to send to backend
    payload = computed<PreServicioSelection>(() => {
      const enabled = this.enabledMap();
      const qty = this.qtyMap();
  
      const addons = this.pricing.catalog
        .filter(a => enabled[a.id as AddonId])
        .map(a => ({ id: a.id, qty: Math.max(1, qty[a.id as AddonId] ?? 1) }));
  
      return {
        vehicle: this.vehicle(),
        packageId: this.pkg(),
        carDescription: this.carDesc,
        details: {
          aspiradoCajuela: this.details.aspiradoCajuela(),
          aromatizante: this.details.aromatizante(),
          aroma: this.details.aroma(),
          armorTablero: this.details.armorTablero(),
          armorLlantas: this.details.armorLlantas(),
        },
        addons,
        paymentMethod: this.pay(),
      };
    });
  
    breakdown = computed(() => this.pricing.getBreakdown(this.payload()));
  
    adicionales = computed(() => this.pricing.catalog.filter(x => x.section === 'adicional'));
    especiales = computed(() => this.pricing.catalog.filter(x => x.section === 'especial'));
  
    enabled(id: AddonId){ return !!this.enabledMap()[id]; }
    qty(id: AddonId){ return this.qtyMap()[id] ?? 1; }
  
    toggleAddon(id: AddonId){
      const cur = this.enabledMap();
      this.enabledMap.set({ ...cur, [id]: !cur[id] });
    }
  
    incQty(id: AddonId){
      if (!this.enabled(id)) return;
      const q = this.qtyMap();
      this.qtyMap.set({ ...q, [id]: (q[id] ?? 1) + 1 });
    }
  
    decQty(id: AddonId){
      if (!this.enabled(id)) return;
      const q = this.qtyMap();
      this.qtyMap.set({ ...q, [id]: Math.max(1, (q[id] ?? 1) - 1) });
    }
  
    setQty(id: AddonId, raw: string){
      if (!this.enabled(id)) return;
      const parsed = parseInt(String(raw).replace(/\D/g,''), 10);
      const safe = Number.isFinite(parsed) ? Math.max(1, parsed) : 1;
      const q = this.qtyMap();
      this.qtyMap.set({ ...q, [id]: safe });
    }
  
    generateCode(){
      const rand = Math.random().toString(36).slice(2,7).toUpperCase();
      this.code.set(`CW-${rand}`);
      // aquí ya podrías POSTear payload() a backend y regresar un código real
      // console.log('PAYLOAD ->', this.payload());
    }
}
