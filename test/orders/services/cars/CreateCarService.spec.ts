import "reflect-metadata";
import { ICarRepository } from "@modules/cars/domain/repositories/ICarRepository";
import AppError from "@shared/errors/AppError";
import CreateCarService from "@modules/cars/services/CreateCarService";
import { ICarItemRepository } from "@modules/cars/domain/repositories/ICarItemRepository";

jest.mock("axios");

describe("CreateCarService", () => {
  let createCarService: CreateCarService;

  const mockCarRepository: jest.Mocked<ICarRepository> = {
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findByPlate: jest.fn(),
    update: jest.fn(),
  };

  const mockCarItemRepository: jest.Mocked<ICarItemRepository> = {
    create: jest.fn(),
    createMany: jest.fn(),
    delete: jest.fn(),
    deleteByCar: jest.fn(),
    findByCar: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
  }

  beforeEach(() => {
    createCarService = new CreateCarService(
      mockCarRepository as any,
      mockCarItemRepository as any
    );
  }); 
 
  it('should throw an error year car grandiest for 11', async () => {
    expect(
      createCarService.execute({
        id: '1',
        year: 2000
      })
    ).rejects.toThrow(new AppError('O ano do carro não pode ser maior que 11 anos.'))
  })

  it('should throw an plate exist', async () => {
    mockCarRepository.findByPlate.mockResolvedValue({plate: 'OKC4C99'})
  
    expect(
      createCarService.execute({
        id: '1',
        year: 2020,
        plate: 'OKC4C99'
      })
    ).rejects.toThrow(new AppError('Já existe um carro cadastrado com esta placa.'))
  })
  it('should throw for 6 items', async () => {
    mockCarRepository.findByPlate.mockResolvedValue(null)
  
    expect(
      createCarService.execute({
        id: '1',
        year: 2020,
        plate: 'OKC4C99',
        items: ["ar", "ob", "ob1", "ob2", "ob3", "ob65"]
      })
    ).rejects.toThrow(new AppError('O número máximo de itens é 5.'))
  })
  it('should create a car and its items successfully', async () => {
    mockCarRepository.findByPlate.mockResolvedValueOnce(null);
  
    const createCarInput = {
      id: '1',
      year: 2020,
      plate: 'OKC4C99',
      items: ['ar', 'ob']
    };
  
    await createCarService.execute(createCarInput);
  
    expect(mockCarRepository.create).toHaveBeenCalledWith(
      {
        plate: 'OKC4C99',
        brand: undefined,
        model: undefined,
        km: 0,
        year: 2020,
        price: undefined,
        status: 'ativo',
        createdAt: expect.any(Date), 
        updatedAt: expect.any(Date), 
      }
    );
  
    expect(mockCarItemRepository.createMany).toHaveBeenCalledWith(
      [{
          name: 'ar',
          cars: undefined,
          createdAt: expect.any(Date), 
          updatedAt: expect.any(Date), 
        },
        {
          name: 'ob',
          cars: undefined,
          createdAt: expect.any(Date), 
          updatedAt: expect.any(Date), 
        },
      ])
  });
  
});
