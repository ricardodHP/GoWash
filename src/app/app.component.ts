import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SummaryStickyComponent } from './summary-sticky.component';
import { PricingService } from './pricing.service';
import { AddonId, PackageId, PreServicioSelection, VehicleType } from './models';

type PayMethod = 'efectivo' | 'tarjeta' | 'saldo';

interface Addon {
  id: AddonId;
  label: string;
  price: number;
  qtyEnabled: boolean;
  defaultQty: number;
  section: 'adicional' | 'especial';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, SummaryStickyComponent],
  template: `
  <div class="appShell">

    <!-- HEADER -->
    <header class="header">
      <div class="topbar">
        <button class="back" type="button" aria-label="Volver">←</button>
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

    <!-- LAYOUT: 2 columnas en desktop -->
    <main class="layout">
      <!-- LEFT -->
      <section class="left">

        <!-- 01 -->
        <div class="step"><span>01.</span> Selecciona el tipo de vehículo</div>
        <div class="card">
          <div class="grid">
            <button class="veh" type="button"
              [class.selected]="vehicle() === 'chico'"
              (click)="vehicle.set('chico')">
              <div class="ico">🚗</div>
              <div>
                <div class="lbl">Chico</div>
                <small>Compacto</small>
              </div>
            </button>

            <button class="veh" type="button"
              [class.selected]="vehicle() === 'mediano'"
              (click)="vehicle.set('mediano')">
              <div class="ico">🚙</div>
              <div>
                <div class="lbl">Mediano</div>
                <small>Sedan/SUV</small>
              </div>
            </button>

            <button class="veh" type="button"
              [class.selected]="vehicle() === 'grande'"
              (click)="vehicle.set('grande')">
              <div class="ico">🛻</div>
              <div>
                <div class="lbl">Grande</div>
                <small>Pick-up</small>
              </div>
            </button>

            <button class="veh" type="button"
              [class.selected]="vehicle() === 'extra'"
              (click)="vehicle.set('extra')">
              <div class="ico">🚚</div>
              <div>
                <div class="lbl">Extra grande</div>
                <small>Van / Cargo</small>
              </div>
            </button>
          </div>

          <div class="field">
            <label>Descripción del automóvil (Ej. Jetta rojo)</label>
            <input class="input" [(ngModel)]="carDesc" placeholder="Ej. Pointer rojo" />
          </div>
        </div>

        <!-- 02 -->
        <div class="step"><span>02.</span> Selecciona el paquete</div>
        <div class="card">
          <label>Paquete</label>
          <select class="input" [ngModel]="pkg()" (ngModelChange)="pkg.set($event)">
            <option value="completo">Servicio completo</option>
            <option value="exterior">Lavado exterior</option>
            <option value="aspirado">Lavado + aspirado</option>
            <option value="premium">Detallado premium</option>
          </select>

          <div class="priceBox">
            <div class="priceTitle">Detalles del servicio</div>
            <div class="price">
              {{ basePrice() | currency:'MXN':'symbol':'1.2-2' }}
            </div>
            <div class="meta">
              <span class="pill">⏱️ {{ durationMinutes() }} min</span>
            </div>

            <div class="list">
              <div class="row">
                <div class="leftRow">
                  <p class="name">Aspirado cajuela</p>
                </div>
                <div class="rightRow">
                  <input class="toggle" id="t-asp" type="checkbox" [checked]="aspiradoCajuela()" (change)="aspiradoCajuela.set(!aspiradoCajuela())" />
                  <label class="switch" for="t-asp"></label>
                </div>
              </div>

              <div class="row" style="align-items:flex-start;">
                <div class="leftRow">
                  <p class="name">Aromatizante en spray</p>
                  <div class="radios">
                    <label class="radio"><input type="radio" name="aroma" value="coco"   [checked]="aroma()==='coco'"   (change)="aroma.set('coco')"> Coco</label>
                    <label class="radio"><input type="radio" name="aroma" value="canela" [checked]="aroma()==='canela'" (change)="aroma.set('canela')"> Canela</label>
                    <label class="radio"><input type="radio" name="aroma" value="auto"   [checked]="aroma()==='auto'"   (change)="aroma.set('auto')"> Auto nuevo</label>
                    <label class="radio"><input type="radio" name="aroma" value="brisa"  [checked]="aroma()==='brisa'"  (change)="aroma.set('brisa')"> Brisa marina</label>
                  </div>
                </div>
                <div class="rightRow" style="padding-top:2px;">
                  <input class="toggle" id="t-aro" type="checkbox" [checked]="aromatizante()" (change)="aromatizante.set(!aromatizante())" />
                  <label class="switch" for="t-aro"></label>
                </div>
              </div>

              <div class="row">
                <div class="leftRow"><p class="name">Armor All en tablero</p></div>
                <div class="rightRow">
                  <input class="toggle" id="t-tab" type="checkbox" [checked]="armorTablero()" (change)="armorTablero.set(!armorTablero())" />
                  <label class="switch" for="t-tab"></label>
                </div>
              </div>

              <div class="row">
                <div class="leftRow"><p class="name">Armor All en llantas</p></div>
                <div class="rightRow">
                  <input class="toggle" id="t-lla" type="checkbox" [checked]="armorLlantas()" (change)="armorLlantas.set(!armorLlantas())" />
                  <label class="switch" for="t-lla"></label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 03 -->
        <div class="step">
          <span>03.</span> Servicios adicionales <span class="mutedInline">(costo extra)</span>
        </div>
        <div class="addon" *ngFor="let a of adicionales()">
          <div class="row">
            <div class="leftRow">
              <p class="name">{{ a.label }}</p>
              <p class="hint">{{ a.price | currency:'MXN':'symbol':'1.2-2' }}</p>
            </div>

            <div class="rightRow qty">
              <input class="toggle" [id]="'en_'+a.id" type="checkbox"
                [checked]="enabled(a.id)"
                (change)="toggleAddon(a.id)" />
              <label class="switch" [for]="'en_'+a.id"></label>

              <button class="counter" type="button" (click)="decQty(a.id)" [disabled]="!enabled(a.id)">−</button>
              <input class="qtyInput" [value]="qty(a.id)" (input)="setQty(a.id, $any($event.target).value)" [disabled]="!enabled(a.id)" />
              <button class="counter" type="button" (click)="incQty(a.id)" [disabled]="!enabled(a.id)">+</button>
            </div>
          </div>
        </div>

        <!-- 04 -->
        <div class="step">
          <span>04.</span> Servicios especiales <span class="mutedInline">(costo extra)</span>
        </div>
        <div class="addon" *ngFor="let a of especiales()">
          <div class="row">
            <div class="leftRow">
              <p class="name">{{ a.label }}</p>
              <p class="hint">{{ a.price | currency:'MXN':'symbol':'1.2-2' }}</p>
            </div>

            <div class="rightRow qty">
              <input class="toggle" [id]="'en_'+a.id" type="checkbox"
                [checked]="enabled(a.id)"
                (change)="toggleAddon(a.id)" />
              <label class="switch" [for]="'en_'+a.id"></label>

              <button class="counter" type="button" (click)="decQty(a.id)" [disabled]="!enabled(a.id)">−</button>
              <input class="qtyInput" [value]="qty(a.id)" (input)="setQty(a.id, $any($event.target).value)" [disabled]="!enabled(a.id)" />
              <button class="counter" type="button" (click)="incQty(a.id)" [disabled]="!enabled(a.id)">+</button>
            </div>
          </div>
        </div>

        <!-- 05 -->
        <div class="step">
          <span>05.</span> Selecciona el método de pago <span class="mutedInline">al llegar al autolavado</span>
        </div>
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

          <button class="btn" type="button" (click)="generateCode()">
            ACEPTAR Y GENERAR CÓDIGO
          </button>
          <div class="terms">*Acepto los términos de uso</div>

          <div class="code" *ngIf="code()">
            <div class="codeLabel">Código generado</div>
            <div class="codeValue">{{ code() }}</div>
          </div>
        </div>

      </section>

      <!-- RIGHT (sticky resumen) -->
      <aside class="right">
        <app-summary-sticky
          [selection]="selection()"
          [breakdown]="breakdown()"
        ></app-summary-sticky>
      </aside>
    </main>

  </div>
  `,
  styles: [`
  :host{display:block}
  :root{}
  .appShell{
    --brand:#0aa9c6;
    --brand-dark:#078aa2;
    --bg:#f4f7fb;
    --card:#ffffff;
    --text:#243041;
    --muted:#7a8797;
    --line:#e6edf5;
    --shadow: 0 8px 24px rgba(0,0,0,.08);
    --radius:16px;
    --primary:#2f7df6;
    --ok:#25c26e;
    background:var(--bg);
    min-height:100vh;
    color:var(--text);
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  }

  .header{
    background: linear-gradient(135deg, var(--brand) 0%, #12b9d4 45%, #0bb1cd 100%);
    color:#fff;
    padding:18px 16px 14px;
    box-shadow: 0 6px 18px rgba(0,0,0,.10);
    position:sticky;
    top:0;
    z-index:10;
  }
  .topbar{display:flex;align-items:center;gap:10px}
  .back{
    width:36px;height:36px;border-radius:999px;
    border:1px solid rgba(255,255,255,.18);
    background:rgba(255,255,255,.14);
    color:#fff;
    font-size:18px;
    cursor:pointer;
  }
  .title{display:flex;align-items:center;gap:10px;font-weight:900;letter-spacing:.5px}
  .icon{
    width:36px;height:36px;border-radius:12px;
    border:1px solid rgba(255,255,255,.18);
    background:rgba(255,255,255,.14);
    display:grid;place-items:center;
  }
  h1{margin:0;font-size:22px;line-height:1}
  .subtitle{margin-top:10px;display:flex;gap:10px;align-items:flex-start;font-size:12px}
  .badge{
    width:28px;height:28px;border-radius:10px;
    border:1px solid rgba(255,255,255,.18);
    background:rgba(255,255,255,.16);
    display:grid;place-items:center;
    flex:0 0 auto;
  }
  .subtitle p{margin:0;opacity:.95;max-width:520px}

  /* Layout */
  .layout{
    display:grid;
    grid-template-columns: 1fr;
    gap:14px;
    padding:14px;
    max-width: 1100px;
    margin: 0 auto;
  }
  .left{min-width:0}
  .right{min-width:0}

  /* Desktop 2 columnas */
  @media (min-width: 1024px){
    .layout{
      grid-template-columns: 1fr 360px;
      align-items:start;
    }
    .right{
      position:sticky;
      top: 96px; /* debajo del header */
      height: fit-content;
    }
  }

  .step{
    margin:12px 0 10px;
    font-weight:900;
    color:var(--brand-dark);
    font-size:12px;
    text-transform:uppercase;
    letter-spacing:.6px;
  }
  .step span{margin-right:6px}
  .mutedInline{
    text-transform:none;
    font-weight:800;
    color:var(--muted);
    letter-spacing:0;
  }

  .card{
    background:var(--card);
    border:1px solid var(--line);
    border-radius:var(--radius);
    box-shadow: var(--shadow);
    padding:14px;
  }

  .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .veh{
    border:1px solid var(--line);
    border-radius:14px;
    padding:12px 10px;
    background:#fff;
    display:flex;
    gap:10px;
    align-items:center;
    cursor:pointer;
    transition:.15s ease;
    text-align:left;
  }
  .veh:hover{transform:translateY(-1px)}
  .veh.selected{
    border-color: rgba(47,125,246,.35);
    box-shadow: 0 8px 18px rgba(47,125,246,.12);
    outline: 2px solid rgba(47,125,246,.16);
  }
  .ico{
    width:42px;height:42px;border-radius:12px;
    background:#f2f7ff;border:1px solid #e8f0ff;
    display:grid;place-items:center;
    flex:0 0 auto;
  }
  .lbl{font-weight:900;font-size:13px}
  small{display:block;color:var(--muted);font-weight:700;font-size:11px;margin-top:2px}

  .field{margin-top:12px}
  label{display:block;font-size:12px;color:var(--muted);margin-bottom:6px;font-weight:800}
  .input, select{
    width:100%;
    padding:12px 12px;
    border:1px solid var(--line);
    border-radius:12px;
    background:#fff;
    font-weight:800;
    color:var(--text);
    outline:none;
  }

  .priceBox{
    margin-top:12px;
    border:1px solid var(--line);
    border-radius:14px;
    padding:12px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  }
  .priceTitle{text-align:center;color:var(--muted);font-weight:900;font-size:12px;margin-bottom:6px}
  .price{text-align:center;font-weight:1000;font-size:34px;color:#2b7de9;margin:2px 0 6px}
  .meta{display:flex;justify-content:center;gap:10px;align-items:center;color:var(--muted);font-weight:900;font-size:12px;margin-bottom:10px}
  .pill{padding:6px 10px;border-radius:999px;background:#f2f6ff;border:1px solid #e8f0ff}

  .list{display:flex;flex-direction:column;gap:10px;margin-top:10px}
  .row{display:flex;justify-content:space-between;align-items:center;gap:10px}
  .leftRow{min-width:0}
  .rightRow{flex:0 0 auto}
  .name{font-weight:900;font-size:13px;margin:0}
  .hint{margin:2px 0 0;font-size:11px;color:var(--muted);font-weight:800}

  .toggle{display:none}
  .switch{
    position:relative;
    width:46px;height:26px;border-radius:999px;
    background:#d7deea;border:1px solid #cfd8e6;
    cursor:pointer;transition:.15s ease;
    display:inline-block;
  }
  .switch::after{
    content:"";
    position:absolute;
    top:3px; left:3px;
    width:20px;height:20px;border-radius:999px;
    background:#fff;
    box-shadow:0 6px 14px rgba(0,0,0,.15);
    transition:.15s ease;
  }
  .toggle:checked + .switch{
    background:rgba(47,125,246,.95);
    border-color:rgba(47,125,246,.95);
  }
  .toggle:checked + .switch::after{left:23px}

  .radios{margin-top:8px;display:flex;flex-direction:column;gap:6px}
  .radio{display:flex;align-items:center;gap:10px;color:var(--muted);font-weight:800;font-size:12px}
  .radio input{accent-color: var(--primary);}

  .addon{
    border:1px solid var(--line);
    border-radius:14px;
    padding:12px;
    background:#fff;
    box-shadow: 0 10px 22px rgba(0,0,0,.05);
    margin-top:10px;
  }
  .qty{display:flex;align-items:center;gap:10px}
  .counter{
    width:38px;height:34px;border-radius:10px;border:1px solid var(--line);
    background:#fff;font-weight:1000;cursor:pointer;
  }
  .counter:disabled{opacity:.45;cursor:not-allowed}
  .qtyInput{
    width:44px;text-align:center;
    padding:9px 8px;border-radius:10px;border:1px solid var(--line);
    font-weight:1000;
  }
  .qtyInput:disabled{opacity:.55}

  .payOpt{
    display:flex;align-items:center;gap:10px;
    font-weight:900;color:var(--text);
    padding:10px 10px;border:1px solid var(--line);
    border-radius:14px;background:#fff;
    margin-bottom:10px;
  }
  .payOpt input{accent-color: var(--ok);}

  .btn{
    width:100%;
    border:none;border-radius:14px;
    padding:14px 14px;
    background: var(--primary);
    color:#fff;
    font-weight:1000;
    letter-spacing:.3px;
    cursor:pointer;
    box-shadow: 0 14px 30px rgba(47,125,246,.25);
    margin-top:6px;
  }
  .terms{margin-top:10px;font-size:11px;color:var(--muted);text-align:center;font-weight:800}

  .code{
    margin-top:12px;
    border:1px dashed #cfe0ff;
    background:#f6f9ff;
    border-radius:14px;
    padding:12px;
  }
  .codeLabel{font-size:12px;color:var(--muted);font-weight:900}
  .codeValue{font-size:18px;font-weight:1000;letter-spacing:2px;margin-top:6px}

  `]
})
export class AppComponent {
  private pricingService = inject(PricingService);

  // -------------------------
  // State (Signals)
  // -------------------------
  vehicle = signal<VehicleType>('chico');
  pkg = signal<PackageId>('completo');

  aspiradoCajuela = signal(true);
  aromatizante = signal(true);
  aroma = signal<'coco'|'canela'|'auto'|'brisa'>('canela');
  armorTablero = signal(false);
  armorLlantas = signal(false);

  pay = signal<PayMethod>('efectivo');
  code = signal<string>('');

  carDesc = '';

  // Duration by package (mock)
  private pkgDuration: Record<PackageId, number> = {
    completo: 60,
    exterior: 30,
    aspirado: 45,
    premium: 90
  };

  // Addons catalog
  private catalog: Addon[] = [
    ...this.pricingService.catalog.map((item) => ({
      ...item,
      qtyEnabled: true,
      defaultQty: 1,
    })),
  ];

  // Enabled + qty by addon id
  private addonEnabled = signal<Record<AddonId, boolean>>({
    aroma_corcho: false,
    bolsa_basura: false,
    cera_lujo: false,
    par_tapetes: true,
    corcho: false,
    ecoloco: false,
    extra_lodo: false,
    extra_sucio: true
  });

  private addonQty = signal<Record<AddonId, number>>({
    aroma_corcho: 1,
    bolsa_basura: 1,
    cera_lujo: 1,
    par_tapetes: 1,
    corcho: 1,
    ecoloco: 1,
    extra_lodo: 1,
    extra_sucio: 1
  });

  // -------------------------
  // Computed
  // -------------------------
  pricingBreakdown = computed(() => this.pricingService.getBreakdown(this.buildSelection()));

  basePrice = computed(() => this.pricingBreakdown().base);

  durationMinutes = computed(() => this.pkgDuration[this.pkg()]);

  adicionales = computed(() => this.catalog.filter(c => c.section === 'adicional'));
  especiales = computed(() => this.catalog.filter(c => c.section === 'especial'));

  selectedAddons = computed(() => {
    const enabledMap = this.addonEnabled();
    const qtyMap = this.addonQty();
    return this.catalog
      .filter(a => enabledMap[a.id])
      .map(a => {
        const qty = Math.max(1, qtyMap[a.id] ?? 1);
        const unitPrice = this.pricingService.getAddonUnitPrice(a.id);
        const subtotal = this.round(unitPrice * qty);
        return {
          ...a,
          label: this.pricingService.getAddonLabel(a.id),
          price: unitPrice,
          qty,
          subtotal,
        };
      });
  });

  extrasTotal = computed(() => this.pricingBreakdown().extras);

  total = computed(() => this.pricingBreakdown().total);

  selection = computed<PreServicioSelection>(() => ({
    vehicle: this.vehicleLabel(this.vehicle()),
    paymentMethod: this.payLabel(this.pay())
  }));

  breakdown = computed<PricingBreakdown>(() => {
    const lines = [
      {
        label: `Base (${this.pkgLabel(this.pkg())})`,
        amount: this.basePrice()
      },
      ...this.selectedAddons().map(item => ({
        label: `${item.label}${item.qty > 1 ? ` ×${item.qty}` : ''}`,
        amount: item.subtotal
      }))
    ];
    const total = lines.reduce((acc, line) => acc + line.amount, 0);
    return { lines, total: Math.round(total * 100) / 100 };
  });

  // -------------------------
  // UI helpers
  // -------------------------
  enabled(id: AddonId) { return !!this.addonEnabled()[id]; }
  qty(id: AddonId) { return this.addonQty()[id] ?? 1; }

  toggleAddon(id: AddonId) {
    const cur = this.addonEnabled();
    const next = { ...cur, [id]: !cur[id] };
    this.addonEnabled.set(next);

    // si se activa, asegura qty mínimo
    if (!cur[id]) {
      const q = this.addonQty();
      const safeQty = Math.max(1, q[id] ?? 1);
      this.addonQty.set({ ...q, [id]: safeQty });
    }
  }

  incQty(id: AddonId) {
    if (!this.enabled(id)) return;
    const q = this.addonQty();
    this.addonQty.set({ ...q, [id]: (q[id] ?? 1) + 1 });
  }

  decQty(id: AddonId) {
    if (!this.enabled(id)) return;
    const q = this.addonQty();
    this.addonQty.set({ ...q, [id]: Math.max(1, (q[id] ?? 1) - 1) });
  }

  setQty(id: AddonId, raw: string) {
    if (!this.enabled(id)) return;
    const parsed = parseInt(String(raw).replace(/\D/g, ''), 10);
    const safe = Number.isFinite(parsed) ? Math.max(1, parsed) : 1;
    const q = this.addonQty();
    this.addonQty.set({ ...q, [id]: safe });
  }

  pkgLabel(id: PackageId) {
    return ({
      completo:'Servicio completo',
      exterior:'Lavado exterior',
      aspirado:'Lavado + aspirado',
      premium:'Detallado premium'
    } as const)[id];
  }

  vehicleLabel(v: VehicleType) {
    return ({ chico:'Chico', mediano:'Mediano', grande:'Grande', extra:'Extra grande' } as const)[v];
  }

  payLabel(p: PayMethod) {
    return ({ efectivo:'Efectivo', tarjeta:'Tarjeta', saldo:'Saldo Carwash' } as const)[p];
  }

  generateCode() {
    // mock simple
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    this.code.set(`CW-${rand}`);
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private buildSelection(): PreServicioSelection {
    const enabledMap = this.addonEnabled();
    const qtyMap = this.addonQty();
    const addons = this.catalog
      .filter((addon) => enabledMap[addon.id])
      .map((addon) => ({
        id: addon.id,
        qty: Math.max(1, qtyMap[addon.id] ?? 1),
      }));

    return {
      vehicle: this.vehicle(),
      packageId: this.pkg(),
      addons,
    };
  }

  private round(n: number): number {
    return Math.round(n * 100) / 100;
  }
}
