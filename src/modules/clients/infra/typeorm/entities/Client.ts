import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Order } from '@modules/orders/infra/typeorm/entities/Order';
import { IClient } from '@modules/clients/domain/models/IClient';

@Entity('clients')
class Client implements IClient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ unique: true })
  cpf: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @OneToMany(() => Order, (order) => order.client, { eager: true })
  orders: Order[];
}

export default Client;
