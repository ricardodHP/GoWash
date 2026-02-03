export interface PricingLine {
export type VehicleType = 'chico' | 'mediano' | 'grande' | 'extra';
export type PackageId = 'completo' | 'exterior' | 'aspirado' | 'premium';
export type PayMethod = 'efectivo' | 'tarjeta' | 'saldo';
export type AddonId =
  | 'aroma_corcho'
  | 'bolsa_basura'
  | 'cera_lujo'
  | 'par_tapetes'
  | 'corcho'
  | 'ecoloco'
  | 'extra_lodo'
  | 'extra_sucio';

export interface AddonCatalogItem {
  id: AddonId;
  label: string;
  price: number;
  section: 'adicional' | 'especial';
}

export interface AddonSelection {
  id: AddonId;
  qty: number;
}

export interface PreServicioSelection {
  vehicle: VehicleType;
  packageId: PackageId;
  addons: AddonSelection[];
}

export interface PricingLine {
  key: string;
  label: string;
  amount: number;
}

export interface PricingBreakdown {
  lines: PricingLine[];
  total: number;
}

export interface PreServicioSelection {
  vehicle: string;
  paymentMethod: string;
  base: number;
  extras: number;
  total: number;
  lines: PricingLine[];
}
