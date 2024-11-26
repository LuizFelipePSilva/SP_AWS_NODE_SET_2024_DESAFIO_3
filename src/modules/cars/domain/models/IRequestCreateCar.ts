import CarItem from '@modules/cars/infra/typeorm/entities/CarItem';
import { ICarItem } from './ICarItem';

export interface IRequestCreateCar {
  plate: string;
  brand: string;
  model: string;
  km: number;
  year: number;
  items: string[];
  price: number;
  //createdt: Date | null;
  //updatedAt: Date | null;
}
