import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Car, { statusEnum } from '@modules/cars/infra/typeorm/entities/Cars';
import { ICarRepository } from '@modules/cars/domain/repositories/ICarRepository';
import { ICarItemRepository } from '@modules/cars/domain/repositories/ICarItemRepository';
import { IRequestCreateCar } from '../domain/models/IRequestCreateCar';

@injectable()
class CreateCarService {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,

    @inject('CarItemRepository')
    private carItemRepository: ICarItemRepository
  ) {}

  public async execute({
    plate,
    brand,
    model,
    km = 0,
    year,
    items,
    price,
  }: IRequestCreateCar): Promise<Car> {
    // Validar o ano do carro (não pode ter mais de 11 anos)
    const currentYear = new Date().getFullYear();
    if (year < currentYear - 11) {
      throw new AppError('O ano do carro não pode ser maior que 11 anos.');
    }

    // Verificar unicidade da placa
    const existingCar = await this.carRepository.findByPlate(plate);
    if (existingCar) {
      throw new AppError('Já existe um carro cadastrado com esta placa.');
    }

    //Validar itens (máximo 5 e sem duplicatas)
    const uniqueItems = Array.from(new Set(items)); // Remove duplicatas
    if (uniqueItems.length > 5) {
      throw new AppError('O número máximo de itens é 5.');
    }
    // Criar o carro
    const car = await this.carRepository.create({
      plate,
      brand,
      model,
      km,
      year,
      price,
      status: 'ativo',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Adicionar os itens do carro
    const carItems = uniqueItems.map((itemName) => ({
      name: itemName,
      cars: car,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await this.carItemRepository.createMany(carItems);

    return car;
  }
}

export default CreateCarService;
