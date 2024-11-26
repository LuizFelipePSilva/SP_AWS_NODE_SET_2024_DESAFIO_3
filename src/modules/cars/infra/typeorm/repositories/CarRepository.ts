import { getRepository, Repository } from 'typeorm';
import Car from '@modules/cars/infra/typeorm/entities/Cars';
import {
  ICarRepository,
  IFindAllWithFiltersParams,
  IFindAllWithFiltersResponse,
} from '@modules/cars/domain/repositories/ICarRepository';
import { ICar } from '@modules/cars/domain/models/ICar';
import { ICreateCar } from '@modules/cars/domain/models/ICreateCar';
import AppError from '@shared/errors/AppError';
import { statusEnum } from '@modules/cars/infra/typeorm/entities/Cars';

class CarRepository implements ICarRepository {
  private ormRepository: Repository<Car>;

  constructor() {
    this.ormRepository = getRepository(Car);
  }

  public async create(data: ICreateCar): Promise<ICar> {
    const car = this.ormRepository.create(data);
    await this.ormRepository.save(car);
    return car;
  }

  public async findById(id: string): Promise<ICar | null> {
    return (
      (await this.ormRepository.findOne(id, { relations: ['items'] })) || null
    );
  }

  public async findByPlate(plate: string): Promise<Car | null> {
    const car =
      (await this.ormRepository.findOne({ where: { plate } })) || null;
    return car;
  }

  public async update(car: Car): Promise<Car> {
    return await this.ormRepository.save(car);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  public async findAll(): Promise<ICar[]> {
    return this.ormRepository.find();
  }  
}

export default CarRepository;
