import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateCarService from '@modules/cars/services/CreateCarService';
import SoftDeleteCarService from '@modules/cars/services/SoftDeleteCarService';
import ListCarService from '@modules/cars/services/ListCarService';
import ShowCarService from '@modules/cars/services/ShowCarService';
import UpdateCarService from '@modules/cars/services/UpdateCarService';
import AppError from '@shared/errors/AppError';

export default class CarController {
  public async index(request: Request, response: Response): Promise<Response> {
    const {
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
      page = 1,
      limit = 15,
    } = request.query;

    const listCarService = container.resolve(ListCarService);

    const cars = await listCarService.execute({
      status: status as 'ativo' | 'inativo' | 'excluído',
      plateEnd: plateEnd ? String(plateEnd) : undefined,
      brand: brand ? String(brand) : undefined,
      model: model ? String(model) : undefined,
      items: items ? (items as string[]).slice(0, 5) : undefined,
      maxKm: maxKm ? Number(maxKm) : undefined,
      yearFrom: yearFrom ? Number(yearFrom) : undefined,
      yearTo: yearTo ? Number(yearTo) : undefined,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      page: Number(page),
      limit: Number(limit),
    });
    return response.json(cars);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { plate, brand, model, km, year, items, price } = request.body;

    const createCar = container.resolve(CreateCarService);
    
      const car = await createCar.execute({
        plate,
        brand,
        model,
        km,
        year,
        items,
        price,
      });

      return response.json(car);
  
    
  }

  public async findById(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { id } = request.params;

    const showCarService = container.resolve(ShowCarService);
    
    
      const car = await showCarService.execute({ id });
      return response.json(car);
    
  }

  public async softDelete(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { id } = request.params;

    const softDeleteCarService = container.resolve(SoftDeleteCarService);
    
    
      const car = await softDeleteCarService.execute(id);

      return response.json(car);
    
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { plate, brand, model, km, year, items, price, status } = request.body;

    const updateCarService = container.resolve(UpdateCarService);

    const updatedCar = await updateCarService.execute({
      id,
      plate,
      brand,
      model,
      km,
      year,
      items,
      price,
      status,
    });

    return response.json(updatedCar);
  }
}
