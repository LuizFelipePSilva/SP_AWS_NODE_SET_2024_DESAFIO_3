import "reflect-metadata";
import { IClientRepository } from "@modules/clients/domain/repositories/IClientRepository";
import AppError from "@shared/errors/AppError";
import ShowClientService from "@modules/clients/services/ShowClientService";

jest.mock("axios");

describe("FindClientService", () => {
  let showClientService: ShowClientService;

  const mockClientRepository: jest.Mocked<IClientRepository> = {
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findByCPF: jest.fn(),
    findByEmail: jest.fn(),
    findByName: jest.fn(),
    findByPhone: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() => {
    showClientService = new ShowClientService(
      mockClientRepository as any,
    );
  }); 

    it('client not found by id', async () => {
      mockClientRepository.findById.mockResolvedValue(null)

      expect(
        showClientService.execute({id: '1'})
      ).rejects.toThrow(new AppError('Client not found.'))
    })

    it('client found', async () => {
      mockClientRepository.findById.mockResolvedValue({id: '1', birthDate: new Date('2004-01-01')})

      const result = await showClientService.execute({id: '1'})

      expect(result).toEqual({id: "1", birthDate: new Date('2004-01-01')})
    })
  
});
