import "reflect-metadata";
import { ICarRepository } from "@modules/cars/domain/repositories/ICarRepository";
import AppError from "@shared/errors/AppError";
import ShowCarService from "@modules/cars/services/ShowCarService";

jest.mock("axios");

describe("FindCarService", () => {
  let showCarService: ShowCarService;

  const mockCarRepository: jest.Mocked<ICarRepository> = {
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findByPlate: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(() => {
    showCarService = new ShowCarService(
      mockCarRepository as any,
    );
  }); 
  it('should throw an error car not fould', () => {
    mockCarRepository.findById.mockResolvedValue(null)

    expect(
      showCarService.execute({ìd: '1'})
    ).rejects.toThrow(new AppError('Carro não encontrado.', 404))
  })

  it('should find car successfully', async () => {
    mockCarRepository.findById.mockResolvedValue({id: '1'})
    const result = await showCarService.execute({ìd: '1'})

    expect(result).toEqual({
      id: '1',
    })
  })
 
});
