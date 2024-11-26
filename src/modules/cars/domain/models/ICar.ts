import CarItem from '@modules/cars/infra/typeorm/entities/CarItem';
import { Order } from '@modules/orders/infra/typeorm/entities/Order';

export interface ICar {
  id: string;
  plate: string;
  brand: string;
  model: string;
  km: number;
  year: number;
  price: number;
  status: 'ativo' | 'inativo' | 'excluído'
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date;
  items: CarItem[];
  orders: Order[];
}
