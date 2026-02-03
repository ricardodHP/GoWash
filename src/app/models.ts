export type VehicleType = 'chico' | 'mediano' | 'grande' | 'extra';
export type PackageId = 'completo'; // por ahora 1 paquete; luego lo expandimos
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

export interface SelectedAddon {
  id: AddonId;
  qty: number;
}

export interface PreServicioSelection {
  vehicle: VehicleType;
  packageId: PackageId;
  carDescription: string;

  details: {
    aspiradoCajuela: boolean;
    aromatizante: boolean;
    aroma: 'coco' | 'canela' | 'auto' | 'brisa';
    armorTablero: boolean;
    armorLlantas: boolean;
  };

  addons: SelectedAddon[];
  paymentMethod: PayMethod;
}

export interface PricingBreakdownLine {
  key: string;
  label: string;
  amount: number;
}

export interface PricingBreakdown {
  base: number;
  extras: number;
  total: number;
  lines: PricingBreakdownLine[];
}
