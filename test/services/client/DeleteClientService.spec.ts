import "reflect-metadata";
import { IClientRepository } from "@modules/clients/domain/repositories/IClientRepository";
import AppError from "@shared/errors/AppError";
import DeleteClientService from "@modules/clients/services/DeleteClientService";

jest.mock("axios");

describe("DeleteClientService", () => {
  let deleteClientService: DeleteClientService;

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
    deleteClientService = new DeleteClientService(
      mockClientRepository as any,
    );
  }); 
    it('should throw an error if id not found', async () => {
      mockClientRepository.findById.mockResolvedValue(null)

      await expect(
        deleteClientService.execute({
          id: '1'
        })
      ).rejects.toThrow(new AppError('Client not found.', 400))
    });

    it('should delete client successfully', async () => {
      mockClientRepository.findById.mockResolvedValue({id: '1'})

      const result = await deleteClientService.execute({id: '1'})
      expect(result).toEqual(undefined)
    }) 

});
