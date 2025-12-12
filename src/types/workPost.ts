export interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  unit: string;
  isActive: boolean;
  icon?: string;
}

export interface PriceList {
  _id: string;
  service_id: string;
  price_type: "fixed" | "per_unit" | "range";
  fixed_price?: number;
  unit_price?: number;
  unit?: string;
  min_price?: number;
  max_price?: number;
  description?: string;
  isActive: boolean;
}