export interface IRequestCar {
  status?: 'ativo' | 'inativo' | 'excluído';
  plateEnd?: string;
  brand?: string;
  model?: string;
  items?: string[];
  maxKm?: number;
  yearFrom?: number;
  yearTo?: number;
  priceMin?: number;
  priceMax?: number;
  page: number;
  limit: number;
}
