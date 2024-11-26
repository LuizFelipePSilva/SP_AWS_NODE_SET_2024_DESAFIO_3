import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Car from '@modules/cars/infra/typeorm/entities/Cars';
import { ICarRepository } from '@modules/cars/domain/repositories/ICarRepository';
import { ICarItemRepository } from '@modules/cars/domain/repositories/ICarItemRepository';
import { IRequestUpdateCar } from '@modules/cars/domain/models/IRequestUpdateCar';

@injectable()
class UpdateCarService {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,

    @inject('CarItemRepository')
    private carItemRepository: ICarItemRepository
  ) {}

  public async execute({
    id,
    plate,
    brand,
    model,
    km,
    year,
    items,
    price,
    status,
  }: IRequestUpdateCar): Promise<Car> {
    // Verifica se o carro existe
    const car = await this.carRepository.findById(id);
    if (!car) {
      throw new AppError('Carro não encontrado.');
    }
    if (car.status == 'excluído') {
      throw new AppError(
        'Não é possível atualizar um carro com status "Excluido".'
      );
    }

    // Atualiza os campos permitidos
    if (plate) car.plate = plate;
    if (brand) car.brand = brand;
    if (model) car.model = model;
    if (typeof km === 'number') car.km = km;
    if (typeof year === 'number') car.year = year;
    if (typeof price === 'number') car.price = price;

    // Atualiza o status, se for válido (Ativo ou Inativo)
    if (status && ['ativo', 'inativo'].includes(status)) {
      if (status === 'ativo') car.status = 'ativo';
      else if (status === 'inativo') car.status = 'inativo';
    }

    // Atualiza os itens do carro, se fornecidos
    if (items && items.length > 0 && items.length <= 5) {
      // Remove os itens existentes associados ao carro
      await this.carItemRepository.deleteByCar(car.id);

      // Adiciona os novos itens
      const carItems = items.map((itemName) => ({
        name: itemName,
        cars: car, // Passando a entidade `car` completa para a relação
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await this.carItemRepository.createMany(carItems);
    }

    // Salva o carro atualizado
    car.updatedAt = new Date();
    await this.carRepository.update(car);

    return car;
  }
}

export default UpdateCarService;
