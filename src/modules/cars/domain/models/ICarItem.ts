import Cars from '@modules/cars/infra/typeorm/entities/Cars';
import { ICar } from './ICar';

export interface ICarItem {
  id?: string;
  name: string;
  cars: ICar;
  createdAt: Date | null;
  updatedAt: Date | null;
}
