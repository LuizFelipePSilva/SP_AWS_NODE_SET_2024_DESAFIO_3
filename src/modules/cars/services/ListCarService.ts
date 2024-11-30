import { inject, injectable } from 'tsyringe';
import { ICarRepository } from '@modules/cars/domain/repositories/ICarRepository';
import { ICar } from '@modules/cars/domain/models/ICar';
import AppError from '@shared/errors/AppError';

interface IRequest {
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
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}

interface IResponse {
  data: ICar[];
  total: number;
  page: number;
  limit: number;
}

@injectable()
class ListCarsService {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository
  ) {}

  public async execute({
    status,
    plateEnd,
    brand,
    model,
    items,
    maxKm,
    yearFrom,
    yearTo,
    priceMin,
    priceMax,
    sortField = 'price',
    sortOrder = 'asc',
    page,
    limit,
  }: IRequest): Promise<IResponse> {
    const allCars = await this.carRepository.findAll(); // Busca todos os carros

    // Filtragem
    let filteredCars = allCars;

    if (status) filteredCars = filteredCars.filter(car => car.status === status);
    if (plateEnd)
      filteredCars = filteredCars.filter(car => car.plate.endsWith(plateEnd));
    if (brand) filteredCars = filteredCars.filter(car => car.brand === brand);
    if (model) filteredCars = filteredCars.filter(car => car.model === model);
    if (items && items.length > 0) {
      filteredCars = filteredCars.filter(car =>
        car.items.some(item => items.includes(item.name))
      );
    }
    if (maxKm !== undefined)
      filteredCars = filteredCars.filter(car => car.km <= maxKm);
    if (yearFrom !== undefined)
      filteredCars = filteredCars.filter(car => car.year >= yearFrom);
    if (yearTo !== undefined)
      filteredCars = filteredCars.filter(car => car.year <= yearTo);
    if (priceMin !== undefined)
      filteredCars = filteredCars.filter(car => car.price >= priceMin);
    if (priceMax !== undefined)
      filteredCars = filteredCars.filter(car => car.price <= priceMax);

    if (filteredCars.length === 0) {
      throw new AppError('Nenhum carro encontrado');
    }

    // Ordenação
    filteredCars.sort((a, b) => {
      const fieldA = a[sortField as keyof ICar];
      const fieldB = b[sortField as keyof ICar];

      if (sortOrder === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      }
      return fieldA < fieldB ? 1 : -1;
    });

    // Paginação
    const total = filteredCars.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedCars = filteredCars.slice(startIndex, endIndex);

    return {
      data: paginatedCars,
      total,
      page,
      limit,
    };
  }
}

export default ListCarsService;
