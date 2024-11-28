import "reflect-metadata";
import CreateOrderService from "@modules/orders/services/CreateOrder";
import { IClientRepository } from "@modules/clients/domain/repositories/IClientRepository";
import { ICarRepository } from "@modules/cars/domain/repositories/ICarRepository";
import { IOrderRepository } from "@modules/orders/domain/repositories/IOrderRepository";
import AppError from "@shared/errors/AppError";
import axios from "axios";

jest.mock("axios");

describe("CreateOrderService", () => {
  let createOrderService: CreateOrderService;

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
    createOrderService = new CreateOrderService(
      mockOrderRepository as any,
      mockClientRepository as any,
      mockCarRepository as any
    );
  });
  it("shloud throw if the client not exist", async () => {
    mockClientRepository.findById.mockResolvedValue(null)
    mockCarRepository.findById.mockResolvedValue({id: "1"});  
    mockOrderRepository.findByClient.mockResolvedValue([]);
  
    await expect(
      createOrderService.execute({
        clientId: "1",
        carId: "1",
        cep: "12345678",
        value: 100,
      })
    ).rejects.toThrow(new AppError('Cliente não existe', 400))
  })


  it("should throw if the client already has an open order", async () => {
    mockCarRepository.findById.mockResolvedValue({id: "1"});  
    mockClientRepository.findById.mockResolvedValue({
      id: "1",
    });


    mockOrderRepository.findByClient.mockResolvedValue([{ status: "Aberto" }]);
    await expect(
      createOrderService.execute({
        clientId: "1",
        carId: "1",
        cep: "12345678",
        value: 100,
      })
    ).rejects.toThrow(new AppError('Cliente tem um pedido em aberto', 400));
  });


  it("should throw if the car does not exist", async () => {

    mockCarRepository.findById.mockResolvedValue(null);  
    mockClientRepository.findById.mockResolvedValue({
      id: "1",
    });
    mockOrderRepository.findByClient.mockResolvedValue([]);
    await expect(
      createOrderService.execute({
        clientId: "1",
        carId: "1", 
        cep: "12345678",
        value: 100,
      })
    ).rejects.toThrow(new AppError('Carro não existe', 400)); 
  });

  it("cep não foi informado", async () => {
    mockCarRepository.findById.mockResolvedValue({id: "1"});  
    mockClientRepository.findById.mockResolvedValue({
      id: "1",
    });
    mockOrderRepository.findByClient.mockResolvedValue(null);

    await expect(
      createOrderService.execute({
        clientId: "1",
        carId: "1", 
        value: 100,
      })
    ).rejects.toThrow(new AppError('Nenhum cep foi informado!', 400));
  })

  it("should throw if the provided CEP is invalid", async () => {
    mockCarRepository.findById.mockResolvedValue({ id: "1" }); 
    mockClientRepository.findById.mockResolvedValue({
      id: "1",
      email: "client@example.com",
      fullName: "John Doe",
    });
    mockOrderRepository.findByClient.mockResolvedValue([]);
  
    const invalidCep = "1234"; 
  
    await expect(
      createOrderService.execute({
        clientId: "1",
        carId: "1",
        cep: invalidCep,
        value: 100,
      })
    ).rejects.toThrow(new AppError("Cep Invalido ou foi digitado incorretamente."));
  });

  it("should create an order successfully when the CEP is valid", async () => {
    mockCarRepository.findById.mockResolvedValue({ id: "1" }); 
    mockClientRepository.findById.mockResolvedValue({
      id: "1",
      email: "client@example.com",
      fullName: "John Doe",
    });
    mockOrderRepository.findByClient.mockResolvedValue([]);
    
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        localidade: "Baraúna",
        uf: "RN",
      },
    });
  
    const orderData = {
      clientId: "1",
      carId: "1",
      cep: "59695000",
      value: 100,
    };
  
    // Simula a criação de uma ordem com ID mockado
    mockOrderRepository.create.mockResolvedValue({
      id: "123",
      clientId: "1",
      clientEmail: "client@example.com",
      clientName: "John Doe",
      orderDate: new Date().toISOString().split("T")[0],
      cep: orderData.cep,
      city: "Baraúna",
      uf: "RN",
      totalValue: orderData.value,
      carId: orderData.carId,
      purchaseDate: null,
      status: "Aberto",
      cancellationDate: null,
    });
  
    const result = await createOrderService.execute(orderData);
  
    expect(mockClientRepository.findById).toHaveBeenCalledWith(orderData.clientId);
    expect(mockCarRepository.findById).toHaveBeenCalledWith(orderData.carId);
    expect(mockOrderRepository.findByClient).toHaveBeenCalledWith(orderData.clientId);
    expect(axios.get).toHaveBeenCalledWith(`https://viacep.com.br/ws/${orderData.cep}/json/`);
    expect(mockOrderRepository.create).toHaveBeenCalledWith({
      clientId: "1",
      clientEmail: "client@example.com",
      clientName: "John Doe",
      orderDate: expect.any(Date),
      cep: orderData.cep,
      city: "Baraúna",
      uf: "RN",
      totalValue: orderData.value,
      carId: orderData.carId,
      purchaseDate: null,
      status: "Aberto",
      cancellationDate: null,
    });
  
    // Verifica se o resultado retornado é o esperado
    expect(result).toEqual({
      id: "123",
      clientId: "1",
      clientEmail: "client@example.com",
      clientName: "John Doe",
      orderDate: new Date().toISOString().split("T")[0],
      cep: orderData.cep,
      city: "Baraúna",
      uf: "RN",
      totalValue: 100,
      carId: "1",
      purchaseDate: null,
      status: "Aberto",
      cancellationDate: null,
    });
  });
  

});
