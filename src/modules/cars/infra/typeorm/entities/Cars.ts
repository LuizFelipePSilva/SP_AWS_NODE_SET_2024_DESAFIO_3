import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import CarItem from './CarItem';
import { ICar } from '@modules/cars/domain/models/ICar';
import { Order } from '@modules/orders/infra/typeorm/entities/Order';

export enum statusEnum {
  ativo,
  inativo,
  excluido,
}

@Entity('cars')
class Cars {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  plate: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  km: number;

  @Column()
  year: number;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: ['ativo', 'inativo', 'excluído'],
  })
  status: 'ativo' | 'inativo' | 'excluído';

  @CreateDateColumn()
  createdAt: Date | null;

  @CreateDateColumn()
  updatedAt: Date | null;

  @DeleteDateColumn({ default: null })
  deletedAt: Date;

  @OneToMany(() => CarItem, (carItem) => carItem.cars, { cascade: true })
  items: CarItem[];

  @OneToMany(() => Order, (order) => order.car)
  orders: Order[];
}

export default Cars;
