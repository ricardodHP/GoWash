import { Component, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type VehicleType = 'chico' | 'mediano' | 'grande' | 'extra';
type PackageId = 'completo' | 'exterior' | 'aspirado' | 'premium';
type PayMethod = 'efectivo' | 'tarjeta' | 'saldo';

type AddonId =
  | 'aroma_corcho'
  | 'bolsa_basura'
  | 'cera_lujo'
  | 'par_tapetes'
  | 'corcho'
  | 'ecoloco'
  | 'extra_lodo'
  | 'extra_sucio';

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
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './app.component.html',
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

  /* Summary */
  .summary{
    background:var(--card);
    border:1px solid var(--line);
    border-radius:var(--radius);
    box-shadow: var(--shadow);
    padding:14px;
  }
  .summaryHeader{
    display:flex;
    justify-content:space-between;
    gap:12px;
    align-items:flex-start;
  }
  .sumTitle{font-weight:1000}
  .sumSub{font-size:12px;color:var(--muted);font-weight:800;margin-top:4px}
  .sumTotal{
    font-weight:1100;
    font-size:18px;
    padding:8px 10px;
    border-radius:12px;
    background:#f2f6ff;
    border:1px solid #e8f0ff;
    white-space:nowrap;
  }

  .summarySection{margin-top:12px}
  .sectionTitle{font-size:12px;color:var(--muted);font-weight:1000;text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px}
  .sumRow{
    display:flex;justify-content:space-between;gap:10px;
    font-weight:900;font-size:13px;
    padding:8px 0;
  }
  .sumRow strong{}
  .mutedTiny{color:var(--muted);font-weight:900;font-size:12px}
  .strong{font-weight:1100}

  .divider{height:1px;background:var(--line);margin:10px 0}
  .summaryFooter{margin-top:10px}

  .btnSecondary{
    width:100%;
    border:1px solid var(--line);
    border-radius:14px;
    padding:12px 14px;
    background:#fff;
    font-weight:1000;
    cursor:pointer;
    margin-top:12px;
  }
  `]
})
export class AppComponent {
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

  // Base prices by package (puedes ajustar)
  private pkgPrices: Record<PackageId, number> = {
    completo: 83,
    exterior: 65,
    aspirado: 75,
    premium: 140
  };

  // Duration by package (mock)
  private pkgDuration: Record<PackageId, number> = {
    completo: 60,
    exterior: 30,
    aspirado: 45,
    premium: 90
  };

  // Vehicle multipliers (mock, opcional). Si no quieres variación, pon todo en 1.
  private vehicleFactor: Record<VehicleType, number> = {
    chico: 1.0,
    mediano: 1.1,
    grande: 1.25,
    extra: 1.4
  };

  // Addons catalog
  private catalog: Addon[] = [
    { id:'aroma_corcho', label:'Aroma a corcho', price:15, qtyEnabled:true, defaultQty:1, section:'adicional' },
    { id:'bolsa_basura', label:'Bolsa de basura', price:15, qtyEnabled:true, defaultQty:1, section:'adicional' },
    { id:'cera_lujo', label:'Cera de lujo', price:15, qtyEnabled:true, defaultQty:1, section:'adicional' },
    { id:'par_tapetes', label:'Par de Tapetes (2 unid)', price:15, qtyEnabled:true, defaultQty:1, section:'adicional' },

    { id:'corcho', label:'Corcho', price:15, qtyEnabled:true, defaultQty:1, section:'especial' },
    { id:'ecoloco', label:'Ecoloco', price:15, qtyEnabled:true, defaultQty:1, section:'especial' },
    { id:'extra_lodo', label:'Extra lodo', price:15, qtyEnabled:true, defaultQty:1, section:'especial' },
    { id:'extra_sucio', label:'Extra sucio', price:15, qtyEnabled:true, defaultQty:1, section:'especial' },
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
  basePrice = computed(() => {
    const p = this.pkgPrices[this.pkg()];
    const factor = this.vehicleFactor[this.vehicle()];
    // redondeo a 2 decimales (MXN)
    return Math.round(p * factor * 100) / 100;
  });

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
        const subtotal = Math.round(a.price * qty * 100) / 100;
        return { ...a, qty, subtotal };
      });
  });

  extrasTotal = computed(() => {
    return this.selectedAddons().reduce((acc, it) => acc + it.subtotal, 0);
  });

  total = computed(() => {
    const t = this.basePrice() + this.extrasTotal();
    return Math.round(t * 100) / 100;
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
}
