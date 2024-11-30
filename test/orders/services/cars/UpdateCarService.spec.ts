import "reflect-metadata";
import { ICarRepository } from "@modules/cars/domain/repositories/ICarRepository";
import AppError from "@shared/errors/AppError";
import UpdateCarService from "@modules/cars/services/UpdateCarService";
import { ICarItemRepository } from "@modules/cars/domain/repositories/ICarItemRepository";

jest.mock("axios");

describe("CreateCarService", () => {
  let updateCarService: UpdateCarService;

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
    updateCarService = new UpdateCarService(
      mockCarRepository as any,
      mockCarItemRepository as any
    );
  }); 
  it('should throw an error car not fould', () => {
    mockCarRepository.findById.mockResolvedValue(null)

    expect(
      updateCarService.execute({ìd: '1'})
    ).rejects.toThrow(new AppError('Carro não encontrado.', 404))
  })

  it('should throw an error car status is excluido', () => {
    mockCarRepository.findById.mockResolvedValue({id: '1', status: "excluído"})

    expect(
      updateCarService.execute({ìd: '1'})
    ).rejects.toThrow(new AppError('Não é possível atualizar um carro com status "Excluido".', 400)) 
  })
  it('update car', async () => {
    mockCarRepository.findById.mockResolvedValue({id: '1', status: "ativo"})

    const result = await updateCarService.execute({
      plate: "RYZEN12",
      brand: "bmw",
      model: "Fiant",
      km: 123,
      year: 2020,
      price: 10,
      status: "ativo",
      items: ["pneus", "motor", "banco"]
    })

    expect(result).toEqual({
      id: '1',
      plate: "RYZEN12",
      brand: "bmw",
      model: "Fiant",
      km: 123,
      year: 2020,
      price: 10,
      status: "ativo",
      updatedAt: expect.any(Date)
    })
  })
  it('update car status inativo', async () => {
    mockCarRepository.findById.mockResolvedValue({id: '1', status: "ativo"})

    const result = await updateCarService.execute({
      plate: "RYZEN12",
      brand: "bmw",
      model: "Fiant",
      km: 123,
      year: 2020,
      price: 10,
      status: "inativo",
      items: ["pneus", "motor", "banco"]
    })

    expect(result).toEqual({
      id: '1',
      plate: "RYZEN12",
      brand: "bmw",
      model: "Fiant",
      km: 123,
      year: 2020,
      price: 10,
      status: "inativo",
      updatedAt: expect.any(Date)
    })
  })
  
});
