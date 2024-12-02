import "reflect-metadata";
import { IClientRepository } from "@modules/clients/domain/repositories/IClientRepository";
import AppError from "@shared/errors/AppError";
import UpdateClientService from "@modules/clients/services/UpdateClientService";

jest.mock("axios");

describe("UpdateClientService", () => {
  let updateClientService: UpdateClientService;

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
    updateClientService = new UpdateClientService(
      mockClientRepository as any,
    );
  }); 
  it('should throw an error if id not found', async () => {
    mockClientRepository.findById.mockResolvedValue(null)

    expect(
      updateClientService.execute({id: '1'})
    ).rejects.toThrow(new AppError('Client not found.'))
  })
  it('should throw an error if email already used', async () => {
    mockClientRepository.findById.mockResolvedValue({ìd: '1', email: 'felipe2@gmail.com'})
    mockClientRepository.findByEmail.mockResolvedValue({email: 'felipe1@gmail.com'})

    expect(
      updateClientService.execute({id: '1', email: 'felipe1@gmail.com'})
    ).rejects.toThrow(new AppError('There is already one client with this email.'))
  })

  it('should throw an error if cpf already used', async () => {
    mockClientRepository.findById.mockResolvedValue({ìd: '1', email: 'felipe2@gmail.com', cpf: '12345678910'})
    mockClientRepository.findByEmail.mockResolvedValue(null)
    mockClientRepository.findByCPF.mockResolvedValue({cpf: '12345678911'})

    expect(
      updateClientService.execute({id: '1', email: 'felipe3@gmail.com', cpf: '12345678911'})
    ).rejects.toThrow(new AppError('There is already one client with this CPF.'))
  })

  it('should update a client successfully', async () => {
    mockClientRepository.findById.mockResolvedValue({id: '1', email: 'felipe2@gmail.com', cpf: '12345678910'})
    mockClientRepository.findByEmail.mockResolvedValue(null)
    mockClientRepository.findByCPF.mockResolvedValue(null)

  
      const result = await updateClientService.execute({
        id: '1', 
        email: 'felipe3@gmail.com', 
        cpf: '12345678911',
        birthDate: new Date('2006-01-01'),
        fullName: 'Luiz Felipe Pereira',
        phone: '84994826111'
      })

      expect(result).toEqual({
        id: '1', 
        email: 'felipe3@gmail.com', 
        cpf: '12345678911',
        birthDate: new Date('2006-01-01'),
        fullName: 'Luiz Felipe Pereira',
        phone: '84994826111'
      })

  })
  it('should update client successfully', async () => {
    mockClientRepository.findById.mockResolvedValue({
      id: '1',
      email: 'felipe2@gmail.com', 
      cpf: '12345678910',
      fullName: 'Luiz Felipe Pereira',
      birthDate: new Date('2006-01-01'),
      phone: '9999999999999'
    })
    mockClientRepository.findByEmail.mockResolvedValue(null)
    mockClientRepository.findByCPF.mockResolvedValue(null)

  
      const result = await updateClientService.execute({id: '1'})

      expect(result).toEqual({
        id: '1',
        email: 'felipe2@gmail.com', 
        cpf: '12345678910',
        fullName: 'Luiz Felipe Pereira',
        birthDate: new Date('2006-01-01'),
        phone: '9999999999999'
      })

  })



});
