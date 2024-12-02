import "reflect-metadata";
import { IClientRepository } from "@modules/clients/domain/repositories/IClientRepository";
import { ICarRepository } from "@modules/cars/domain/repositories/ICarRepository";
import { IOrderRepository } from "@modules/orders/domain/repositories/IOrderRepository";
import AppError from "@shared/errors/AppError";
import SoftDeleteOrderService from "@modules/orders/services/SoftDeleteOrder";

describe("SoftDeleteOrder", () => {
  let softDeleteOrderService: SoftDeleteOrderService;
  const mockOrderRepository: jest.Mocked<IOrderRepository> = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findByClient: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(), 
  };

  beforeEach(() => {
    softDeleteOrderService = new SoftDeleteOrderService(
      mockOrderRepository as any,
    );
  });
  it('should throw error if id not found', async () => {
    mockOrderRepository.findById.mockResolvedValue(null);
  
    await expect(
      softDeleteOrderService.execute({id: '1'})
    ).rejects.toThrow(new AppError('Order not found.', 400))
})
it('should delete order successfully', async () => {
  mockOrderRepository.findById.mockResolvedValue({id: 1});

  const result = await softDeleteOrderService.execute({id: '1'})

  expect(result).toEqual("") 

})

});
