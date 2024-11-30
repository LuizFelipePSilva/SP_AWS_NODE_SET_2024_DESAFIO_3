import "reflect-metadata";
import { IClientRepository } from "@modules/clients/domain/repositories/IClientRepository";
import CreateClientService from "@modules/clients/services/CreateClientService";
import AppError from "@shared/errors/AppError";
jest.mock("axios");

describe("CreateClientService", () => {
  let createClientService: CreateClientService;

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
    createClientService = new CreateClientService(
      mockClientRepository as any,
    );
  }); 
  it('Cpf not valid', async () => {
    expect(
      createClientService.execute({cpf: "12345678900"})
    ).rejects.toThrow(new AppError('Invalid CPF.'))
  })

  it('email already used', async () => {
    mockClientRepository.findByEmail.mockResolvedValue({email: 'felipe12@gmail.com'})
    expect(
      createClientService.execute({email: 'felipe12@gmail.com', cpf: "22915309094"})
    ).rejects.toThrow(new AppError('Email address already used.'))
  })

  it('cpf already used', async () => {
    mockClientRepository.findByEmail.mockResolvedValue(null)
    mockClientRepository.findByCPF.mockResolvedValue({cpf: "22915309094"})
    expect(
      createClientService.execute({email: 'felipe12@gmail.com', cpf: "22915309094"})
    ).rejects.toThrow(new AppError('CPF already used.'))
  })

  it('need all parameters', async () => {
    mockClientRepository.findByEmail.mockResolvedValue(null)
    mockClientRepository.findByCPF.mockResolvedValue(null)
    expect(
      createClientService.execute({email: 'felipe12@gmail.com', cpf: "22915309094"})
    ).rejects.toThrow(new AppError('need all parameters.'))
  })

  it('create sucess', async () => {
    mockClientRepository.findByEmail.mockResolvedValue(null)
    mockClientRepository.findByCPF.mockResolvedValue(null)

    mockClientRepository.create.mockResolvedValue({
      email: 'felipe12@gmail.com',
      cpf: "22915309094",
      birthDate: new Date('2024-01-01'),
      fullName: 'Felipe',
      phone: '89999999999',
    });

     const result = await createClientService.execute({
        email: 'felipe12@gmail.com',
        cpf: "22915309094",
        birthDate: new Date('2024-01-01'),
        fullName: 'Felipe',
        phone: '89999999999'
      })
      expect(result).toEqual({
        email: 'felipe12@gmail.com',
        cpf: "22915309094",
        birthDate: new Date('2024-01-01'),
        fullName: 'Felipe',
        phone: '89999999999'
      })
  })




  
});
