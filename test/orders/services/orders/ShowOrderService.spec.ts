import "reflect-metadata";
import { IClientRepository } from "@modules/clients/domain/repositories/IClientRepository";
import { ICarRepository } from "@modules/cars/domain/repositories/ICarRepository";
import { IOrderRepository } from "@modules/orders/domain/repositories/IOrderRepository";
import AppError from "@shared/errors/AppError";
import ShowOrderService from "@modules/orders/services/ShowOrderService";

describe("ShowOrderService", () => {
  let showOrderService: ShowOrderService;

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

  const mockCarRepository: jest.Mocked<ICarRepository> = {
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findByPlate: jest.fn(),
    update: jest.fn(),
  };

  const mockOrderRepository: jest.Mocked<IOrderRepository> = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findByClient: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    showOrderService = new ShowOrderService(
      mockOrderRepository as any,
      mockClientRepository as any,
      mockCarRepository as any
    );
  });

  it('Order not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);
    
      await expect(
        showOrderService.execute({id: '1'})
      ).rejects.toThrow(new AppError('Order not found.', 400))
  })


  it('Client not found', async () => {
    mockOrderRepository.findById.mockResolvedValue({id: '1', carId: '1', clientId: '1'});
    mockClientRepository.findById.mockResolvedValue(null)

    await expect(
      showOrderService.execute({id: '1'})
    ).rejects.toThrow(new AppError('Client not found.', 400))
})


it('Car not found', async () => {
  mockOrderRepository.findById.mockResolvedValue({id: '1', carId: '1', clientId: '1'});
  mockClientRepository.findById.mockResolvedValue({
    id: '1'
  })
  mockCarRepository.findAll.mockResolvedValue({Id: '1'})

  await expect(
    showOrderService.execute({id: '1'})
  ).rejects.toThrow(new AppError('Car not found.', 400))
})

it("should show an order by ID", async () => {
  // Mock do pedido
  mockOrderRepository.findById.mockResolvedValue({
    id: '1',
    carId: "1",
    clientId: "1",
    orderDate: new Date(),
    totalValue: 100,
    cancellationDate: null,
    purchaseDate: null,
    cep: '59695000',
    city: "Barauna",
    uf: "RN",
    clientEmail: "john.doe@example.com" ,
    clientName: "John Doe" ,
    status: 'Aberto'
  });

  // Mock do cliente associado ao pedido
  mockClientRepository.findById.mockResolvedValue({
    id: "1",
    fullName: "John Doe",
    cpf: "12345678901",
    email: "john.doe@example.com",
  });

  // Mock do carro associado ao pedido
  mockCarRepository.findById.mockResolvedValue({
    id: "1",
    model: "Tesla Model S",
    plate: "ABC-1234",
    brand: "Ford",
    km: 99,
    year: 1999,
    items: [
      { name: "Air Conditioning" },
      { name: "Heated Seats" },
    ],
  });

  const result = await showOrderService.execute({ id: "1" });

  expect(result).toEqual({
    order :{
      id: '1',
      carId: "1",
      clientId: "1",
      orderDate: expect.any(Date),
      totalValue: 100,
      cancellationDate: null,
      cep: '59695000',
      city: "Barauna",
      uf: "RN",
      clientEmail: "john.doe@example.com" ,
      clientName: "John Doe" ,
      status: 'Aberto',
      purchaseDate: null
  },
    client: {
      id: "1",
      fullName: "John Doe",
      cpf: "12345678901",
      email: "john.doe@example.com",
    },
    car: {
      id: "1",
      model: "Tesla Model S",
      plate: "ABC-1234",
      brand: "Ford",
      km: 99,
      year: 1999,
      items: [
        { name: "Air Conditioning" },
        { name: "Heated Seats" },
      ]
    },
  });

  expect(result.car.items).toEqual([
    { name: "Air Conditioning" },
    { name: "Heated Seats" },
  ]);
  expect(mockOrderRepository.findById).toHaveBeenCalledWith("1");
  expect(mockClientRepository.findById).toHaveBeenCalledWith("1");
  expect(mockCarRepository.findById).toHaveBeenCalledWith("1");
});

});
