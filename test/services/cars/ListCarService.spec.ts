import 'reflect-metadata';
import { ICarRepository } from '@modules/cars/domain/repositories/ICarRepository';
import ListCarsService from '@modules/cars/services/ListCarService';
import AppError from '@shared/errors/AppError';

describe('ListCarsService', () => {
  let listCarsService: ListCarsService;

  const mockCarRepository: jest.Mocked<ICarRepository> = {
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findByPlate: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(() => {
    listCarsService = new ListCarsService(mockCarRepository);
  });

  it('should list cars with pagination and no filters', async () => {
    mockCarRepository.findAll.mockResolvedValue([
      {
        id: '1',
        status: 'ativo',
        plate: 'ABC1234',
        brand: 'Toyota',
        model: 'Corolla',
        items: [],
        km: 10000,
        year: 2020,
        price: 30000,
      },
    ]);

    const result = await listCarsService.execute({
      page: 1,
      limit: 10,
    });

    expect(result).toEqual({
      data: [
        {
          id: '1',
          status: 'ativo',
          plate: 'ABC1234',
          brand: 'Toyota',
          model: 'Corolla',
          items: [],
          km: 10000,
          year: 2020,
          price: 30000,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    });

    expect(mockCarRepository.findAll).toHaveBeenCalledWith();
  });

  it('should apply filters when listing cars', async () => {
    mockCarRepository.findAll.mockResolvedValue([
      {
        id: '2',
        status: 'inativo',
        plate: 'XYZ9876',
        brand: 'Honda',
        model: 'Civic',
        items: [],
        km: 15000,
        year: 2021,
        price: 35000,
      },
    ]);

    const result = await listCarsService.execute({
      page: 1,
      limit: 5,
      status: 'inativo',
      brand: 'Honda',
      maxKm: 20000,
      priceMin: 30000,
    });

    expect(result).toEqual({
      data: [
        {
          id: '2',
          status: 'inativo',
          plate: 'XYZ9876',
          brand: 'Honda',
          model: 'Civic',
          items: [],
          km: 15000,
          year: 2021,
          price: 35000,
        },
      ],
      total: 1,
      page: 1,
      limit: 5,
    });

    expect(mockCarRepository.findAll).toHaveBeenCalledWith();
  });

  it('should throw an error if no cars are found', async () => {
    mockCarRepository.findAll.mockResolvedValue([]);

    await expect(
      listCarsService.execute({
        page: 1,
        limit: 10,
      })
    ).rejects.toThrow(new AppError('Nenhum carro encontrado'));
  });

  it('should apply sorting to cars', async () => {
    mockCarRepository.findAll.mockResolvedValue([
      {
        id: '3',
        status: 'ativo',
        plate: 'DEF5678',
        brand: 'Ford',
        model: 'Focus',
        items: [],
        km: 5000,
        year: 2022,
        price: 28000,
      },
      {
        id: '4',
        status: 'inativo',
        plate: 'GHI1234',
        brand: 'Chevrolet',
        model: 'Onix',
        items: [],
        km: 10000,
        year: 2021,
        price: 25000,
      },
    ]);

    const result = await listCarsService.execute({
      page: 1,
      limit: 10,
      sortField: 'price',
      sortOrder: 'desc',
    });

    expect(mockCarRepository.findAll).toHaveBeenCalledWith();
    expect(result.data[0].price).toBe(28000);

    
  });

  it('should apply sorting to cars', async () => {
    mockCarRepository.findAll.mockResolvedValue([
      {
        id: '3',
        status: 'ativo',
        plate: 'DEF5678',
        brand: 'Ford',
        model: 'Focus',
        items: [],
        km: 5000,
        year: 2022,
        price: 28000,
      },
      {
        id: '4',
        status: 'inativo',
        plate: 'GHI1234',
        brand: 'Chevrolet',
        model: 'Onix',
        items: [],
        km: 10000,
        year: 2021,
        price: 25000,
      },
    ]);

    const result = await listCarsService.execute({
      page: 1,
      limit: 10,
      sortField: 'price',
      sortOrder: 'asc',
    });

    expect(mockCarRepository.findAll).toHaveBeenCalledWith();
    expect(result.data[0].price).toBe(25000);

    
  });
});
