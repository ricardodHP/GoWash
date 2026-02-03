import { Component, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PricingService } from './pricing.service';
import { AddonId, PreServicioSelection, VehicleType, PayMethod, PackageId } from './models';
import { SummaryStickyComponent } from './summary-sticky.component';

@Component({
  selector: 'app-pre-servicio',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, SummaryStickyComponent],
  template: `
  <div class="shell">

    <header class="header">
      <div class="topbar">
        <button class="back" type="button">←</button>
        <div class="title">
          <div class="icon">📱</div>
          <h1>PRE SERVICIO</h1>
        </div>
      </div>
      <div class="subtitle">
        <div class="badge">🧼</div>
        <p>Aquí puedes seleccionar el servicio que necesitas antes de llegar a tu carwash</p>
      </div>
    </header>

    <main class="layout">
      <section class="left">

        <div class="step"><span>01.</span> Selecciona el tipo de vehículo</div>
        <div class="card">
          <div class="grid">
            <button class="veh" type="button" [class.selected]="vehicle()==='chico'" (click)="vehicle.set('chico')">
              <div class="ico">
                <!-- Si metes imágenes, cambias el emoji por <img [src]="icons.chico" /> -->
                🚗
              </div>
              <div><div class="lbl">Chico</div><small>$100</small></div>
            </button>

            <button class="veh" type="button" [class.selected]="vehicle()==='mediano'" (click)="vehicle.set('mediano')">
              <div class="ico">🚙</div>
              <div><div class="lbl">Mediano</div><small>$120</small></div>
            </button>

            <button class="veh" type="button" [class.selected]="vehicle()==='grande'" (click)="vehicle.set('grande')">
              <div class="ico">🛻</div>
              <div><div class="lbl">Grande</div><small>$150</small></div>
            </button>

            <button class="veh" type="button" [class.selected]="vehicle()==='extra'" (click)="vehicle.set('extra')">
              <div class="ico">🚚</div>
              <div><div class="lbl">Extra grande</div><small>(placeholder)</small></div>
            </button>
          </div>

          <div class="field">
            <label>Descripción del automóvil</label>
            <input class="input" [(ngModel)]="carDesc" placeholder="Ej. Pointer rojo" />
          </div>
        </div>

        <div class="step"><span>02.</span> Paquete</div>
        <div class="card">
          <label>Paquete</label>
          <select class="input" [ngModel]="pkg()" (ngModelChange)="pkg.set($event)">
            <option value="completo">Servicio completo</option>
          </select>

          <div class="priceBox">
            <div class="priceTitle">Detalles del servicio</div>
            <div class="price">{{ breakdown().base | currency:'MXN':'symbol':'1.2-2' }}</div>

            <div class="list">
              <div class="row">
                <div class="leftRow"><p class="name">Aspirado cajuela</p></div>
                <div class="rightRow">
                  <input class="toggle" id="t-asp" type="checkbox" [checked]="details.aspiradoCajuela()" (change)="details.aspiradoCajuela.set(!details.aspiradoCajuela())" />
                  <label class="switch" for="t-asp"></label>
                </div>
              </div>

              <div class="row" style="align-items:flex-start;">
                <div class="leftRow">
                  <p class="name">Aromatizante en spray</p>
                  <div class="radios">
                    <label class="radio"><input type="radio" name="aroma" value="coco" [checked]="details.aroma()==='coco'" (change)="details.aroma.set('coco')" /> Coco</label>
                    <label class="radio"><input type="radio" name="aroma" value="canela" [checked]="details.aroma()==='canela'" (change)="details.aroma.set('canela')" /> Canela</label>
                    <label class="radio"><input type="radio" name="aroma" value="auto" [checked]="details.aroma()==='auto'" (change)="details.aroma.set('auto')" /> Auto nuevo</label>
                    <label class="radio"><input type="radio" name="aroma" value="brisa" [checked]="details.aroma()==='brisa'" (change)="details.aroma.set('brisa')" /> Brisa marina</label>
                  </div>
                </div>
                <div class="rightRow" style="padding-top:2px;">
                  <input class="toggle" id="t-aro" type="checkbox" [checked]="details.aromatizante()" (change)="details.aromatizante.set(!details.aromatizante())" />
                  <label class="switch" for="t-aro"></label>
                </div>
              </div>

              <div class="row">
                <div class="leftRow"><p class="name">Armor All en tablero</p></div>
                <div class="rightRow">
                  <input class="toggle" id="t-tab" type="checkbox" [checked]="details.armorTablero()" (change)="details.armorTablero.set(!details.armorTablero())" />
                  <label class="switch" for="t-tab"></label>
                </div>
              </div>

              <div class="row">
                <div class="leftRow"><p class="name">Armor All en llantas</p></div>
                <div class="rightRow">
                  <input class="toggle" id="t-lla" type="checkbox" [checked]="details.armorLlantas()" (change)="details.armorLlantas.set(!details.armorLlantas())" />
                  <label class="switch" for="t-lla"></label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step"><span>03.</span> Servicios adicionales <span class="mutedInline">(costo extra)</span></div>
        <div class="addon" *ngFor="let a of adicionales()">
          <div class="row">
            <div class="leftRow">
              <p class="name">{{ a.label }}</p>
              <p class="hint">{{ a.price | currency:'MXN':'symbol':'1.2-2' }}</p>
            </div>

            <div class="rightRow qty">
              <input class="toggle" [id]="'en_'+a.id" type="checkbox"
                [checked]="enabled(a.id)" (change)="toggleAddon(a.id)" />
              <label class="switch" [for]="'en_'+a.id"></label>

              <button class="counter" type="button" (click)="decQty(a.id)" [disabled]="!enabled(a.id)">−</button>
              <input class="qtyInput" [value]="qty(a.id)" (input)="setQty(a.id, $any($event.target).value)" [disabled]="!enabled(a.id)" />
              <button class="counter" type="button" (click)="incQty(a.id)" [disabled]="!enabled(a.id)">+</button>
            </div>
          </div>
        </div>

        <div class="step"><span>04.</span> Servicios especiales <span class="mutedInline">(costo extra)</span></div>
        <div class="addon" *ngFor="let a of especiales()">
          <div class="row">
            <div class="leftRow">
              <p class="name">{{ a.label }}</p>
              <p class="hint">{{ a.price | currency:'MXN':'symbol':'1.2-2' }}</p>
            </div>

            <div class="rightRow qty">
              <input class="toggle" [id]="'en_'+a.id" type="checkbox"
                [checked]="enabled(a.id)" (change)="toggleAddon(a.id)" />
              <label class="switch" [for]="'en_'+a.id"></label>

              <button class="counter" type="button" (click)="decQty(a.id)" [disabled]="!enabled(a.id)">−</button>
              <input class="qtyInput" [value]="qty(a.id)" (input)="setQty(a.id, $any($event.target).value)" [disabled]="!enabled(a.id)" />
              <button class="counter" type="button" (click)="incQty(a.id)" [disabled]="!enabled(a.id)">+</button>
            </div>
          </div>
        </div>

        <div class="step"><span>05.</span> Método de pago <span class="mutedInline">al llegar</span></div>
        <div class="card">
          <label class="payOpt">
            <input type="radio" name="pay" value="efectivo" [checked]="pay()==='efectivo'" (change)="pay.set('efectivo')" />
            💵 Pago en efectivo
          </label>

          <label class="payOpt">
            <input type="radio" name="pay" value="tarjeta" [checked]="pay()==='tarjeta'" (change)="pay.set('tarjeta')" />
            💳 Pago con tarjeta
          </label>

          <label class="payOpt">
            <input type="radio" name="pay" value="saldo" [checked]="pay()==='saldo'" (change)="pay.set('saldo')" />
            🧾 Pago con Saldo Carwash
          </label>

          <button class="btn" type="button" (click)="generateCode()">ACEPTAR Y GENERAR CÓDIGO</button>
          <div class="terms">*Acepto los términos de uso</div>

          <div class="code" *ngIf="code()">
            <div class="codeLabel">Código generado</div>
            <div class="codeValue">{{ code() }}</div>
          </div>
        </div>

      </section>

      <aside class="right">
        <app-summary-sticky [selection]="payload()" [breakdown]="breakdown()"></app-summary-sticky>
      </aside>
    </main>
  </div>
  `,
  styles: [`
    .shell{background:#f4f7fb;min-height:100vh;color:#243041;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
    .header{background:linear-gradient(135deg,#0aa9c6 0%,#12b9d4 45%,#0bb1cd 100%);color:#fff;padding:18px 16px 14px;box-shadow:0 6px 18px rgba(0,0,0,.10);position:sticky;top:0;z-index:10}
    .topbar{display:flex;align-items:center;gap:10px}
    .back{width:36px;height:36px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.14);color:#fff;font-size:18px;cursor:pointer}
    .title{display:flex;align-items:center;gap:10px;font-weight:900;letter-spacing:.5px}
    .icon{width:36px;height:36px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.14);display:grid;place-items:center}
    h1{margin:0;font-size:22px}
    .subtitle{margin-top:10px;display:flex;gap:10px;align-items:flex-start;font-size:12px}
    .badge{width:28px;height:28px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.16);display:grid;place-items:center;flex:0 0 auto}
    .subtitle p{margin:0;opacity:.95;max-width:520px}

    .layout{display:grid;grid-template-columns:1fr;gap:14px;padding:14px;max-width:1100px;margin:0 auto}
    @media (min-width:1024px){
      .layout{grid-template-columns:1fr 360px;align-items:start}
      .right{position:sticky;top:96px;height:fit-content}
    }

    .step{margin:12px 0 10px;font-weight:1000;color:#078aa2;font-size:12px;text-transform:uppercase;letter-spacing:.6px}
    .step span{margin-right:6px}
    .mutedInline{text-transform:none;font-weight:800;color:#7a8797;letter-spacing:0}

    .card{background:#fff;border:1px solid #e6edf5;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.08);padding:14px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .veh{border:1px solid #e6edf5;border-radius:14px;padding:12px 10px;background:#fff;display:flex;gap:10px;align-items:center;cursor:pointer;transition:.15s ease;text-align:left}
    .veh:hover{transform:translateY(-1px)}
    .veh.selected{border-color:rgba(47,125,246,.35);box-shadow:0 8px 18px rgba(47,125,246,.12);outline:2px solid rgba(47,125,246,.16)}
    .ico{width:42px;height:42px;border-radius:12px;background:#f2f7ff;border:1px solid #e8f0ff;display:grid;place-items:center;flex:0 0 auto}
    .lbl{font-weight:1000;font-size:13px}
    small{display:block;color:#7a8797;font-weight:800;font-size:11px;margin-top:2px}

    .field{margin-top:12px}
    label{display:block;font-size:12px;color:#7a8797;margin-bottom:6px;font-weight:900}
    .input{width:100%;padding:12px 12px;border:1px solid #e6edf5;border-radius:12px;background:#fff;font-weight:900;color:#243041;outline:none}

    .priceBox{margin-top:12px;border:1px solid #e6edf5;border-radius:14px;padding:12px;background:linear-gradient(180deg,#fff 0%,#fbfdff 100%)}
    .priceTitle{text-align:center;color:#7a8797;font-weight:1000;font-size:12px;margin-bottom:6px}
    .price{text-align:center;font-weight:1100;font-size:34px;color:#2b7de9;margin:2px 0 6px}

    .list{display:flex;flex-direction:column;gap:10px;margin-top:10px}
    .row{display:flex;justify-content:space-between;align-items:center;gap:10px}
    .leftRow{min-width:0}
    .rightRow{flex:0 0 auto}
    .name{font-weight:1000;font-size:13px;margin:0}
    .hint{margin:2px 0 0;font-size:11px;color:#7a8797;font-weight:900}

    .toggle{display:none}
    .switch{position:relative;width:46px;height:26px;border-radius:999px;background:#d7deea;border:1px solid #cfd8e6;cursor:pointer;transition:.15s ease;display:inline-block}
    .switch::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:999px;background:#fff;box-shadow:0 6px 14px rgba(0,0,0,.15);transition:.15s ease}
    .toggle:checked + .switch{background:rgba(47,125,246,.95);border-color:rgba(47,125,246,.95)}
    .toggle:checked + .switch::after{left:23px}

    .radios{margin-top:8px;display:flex;flex-direction:column;gap:6px}
    .radio{display:flex;align-items:center;gap:10px;color:#7a8797;font-weight:900;font-size:12px}
    .radio input{accent-color:#2f7df6}

    .addon{border:1px solid #e6edf5;border-radius:14px;padding:12px;background:#fff;box-shadow:0 10px 22px rgba(0,0,0,.05);margin-top:10px}
    .qty{display:flex;align-items:center;gap:10px}
    .counter{width:38px;height:34px;border-radius:10px;border:1px solid #e6edf5;background:#fff;font-weight:1100;cursor:pointer}
    .counter:disabled{opacity:.45;cursor:not-allowed}
    .qtyInput{width:44px;text-align:center;padding:9px 8px;border-radius:10px;border:1px solid #e6edf5;font-weight:1100}
    .qtyInput:disabled{opacity:.55}

    .payOpt{display:flex;align-items:center;gap:10px;font-weight:1000;color:#243041;padding:10px 10px;border:1px solid #e6edf5;border-radius:14px;background:#fff;margin-bottom:10px}
    .payOpt input{accent-color:#25c26e}

    .btn{width:100%;border:none;border-radius:14px;padding:14px 14px;background:#2f7df6;color:#fff;font-weight:1100;letter-spacing:.3px;cursor:pointer;box-shadow:0 14px 30px rgba(47,125,246,.25);margin-top:6px}
    .terms{margin-top:10px;font-size:11px;color:#7a8797;text-align:center;font-weight:900}

    .code{margin-top:12px;border:1px dashed #cfe0ff;background:#f6f9ff;border-radius:14px;padding:12px}
    .codeLabel{font-size:12px;color:#7a8797;font-weight:1000}
    .codeValue{font-size:18px;font-weight:1100;letter-spacing:2px;margin-top:6px}
  `]
})
export class PreServicioComponent {
  // state
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
    aroma_corcho:false, bolsa_basura:false, cera_lujo:false, par_tapetes:true,
    corcho:false, ecoloco:false, extra_lodo:false, extra_sucio:true
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
      .filter(a => enabled[a.id])
      .map(a => ({ id: a.id, qty: Math.max(1, qty[a.id] ?? 1) }));

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
