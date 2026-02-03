export interface PricingLine {
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
}
