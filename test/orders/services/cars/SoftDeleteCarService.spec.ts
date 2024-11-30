import "reflect-metadata";
import { ICarRepository } from "@modules/cars/domain/repositories/ICarRepository";
import AppError from "@shared/errors/AppError";
import SoftDeleteCarService from "@modules/cars/services/SoftDeleteCarService";

jest.mock("axios");

describe("DeleteCarService", () => {
  let softDeleteCarService: SoftDeleteCarService;

  const mockCarRepository: jest.Mocked<ICarRepository> = {
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findByPlate: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(() => {
    softDeleteCarService = new SoftDeleteCarService(
      mockCarRepository as any,
    );
  }); 
  it('should throw an error car not fould', () => {
    mockCarRepository.findById.mockResolvedValue(null)

    expect(
      softDeleteCarService.execute({ìd: '1'})
    ).rejects.toThrow(new AppError('Carro não encontrado.', 404))
  })

  it('should throw an error car status is excluido', () => {
    mockCarRepository.findById.mockResolvedValue({id: '1', status: "excluído"})

    expect(
      softDeleteCarService.execute({ìd: '1'})
    ).rejects.toThrow(new AppError('Carro já está excluído.', 400)) 
  })

  it('delete sucess', async () => {
    mockCarRepository.findById.mockResolvedValue({id: '1'})
    const result = await softDeleteCarService.execute({ìd: '1'})

    expect(result).toEqual({
      id: '1',
      status: "excluído",
      updatedAt: expect.any(Date)
    })
  })
 
});
