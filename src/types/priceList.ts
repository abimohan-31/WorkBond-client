export interface PriceListType {
  _id: string;
  service_id: string | any; // ServiceType (populated)
  price_type: "fixed" | "per_unit" | "range";
  fixed_price?: number;
  unit_price?: number;
  unit?: string;
  min_price?: number;
  max_price?: number;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePriceListData {
  service_id: string;
  price_type: "fixed" | "per_unit" | "range";
  fixed_price?: number;
  unit_price?: number;
  unit?: string;
  min_price?: number;
  max_price?: number;
  description?: string;
  isActive?: boolean;
}

export interface UpdatePriceListData {
  service_id?: string;
  price_type?: "fixed" | "per_unit" | "range";
  fixed_price?: number;
  unit_price?: number;
  unit?: string;
  min_price?: number;
  max_price?: number;
  description?: string;
  isActive?: boolean;
}

