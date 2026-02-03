export type VehicleType = 'chico' | 'mediano' | 'grande' | 'extra';
export type PackageId = 'completo' | 'exterior' | 'aspirado' | 'premium';

export type AddonId =
  | 'aroma_corcho'
  | 'bolsa_basura'
  | 'cera_lujo'
  | 'par_tapetes'
  | 'corcho'
  | 'ecoloco'
  | 'extra_lodo'
  | 'extra_sucio';

export interface Addon {
  id: AddonId;
  label: string;
  price: number;
  qtyEnabled: boolean;
  defaultQty: number;
  section: 'adicional' | 'especial';
}

export interface PackageConfig {
  id: PackageId;
  label: string;
  basePrice: number;
  durationMinutes: number;
}

export interface VehicleConfig {
  type: VehicleType;
  label: string;
  factor: number;
}

export interface SummaryLine {
  label: string;
  amount: number;
}
