import "reflect-metadata";
import CreateUserService from "@modules/users/services/CreateUser";
import { IUserRepository } from "@modules/users/domain/repositories/IUserRepository";
import { IHashProvider } from "@modules/users/providers/HashProvider/models/IHashProvider";
import AppError from "@shared/errors/AppError";

jest.mock("axios");

describe("CreateUserService", () => {
  let createUserService: CreateUserService;

  const mockUserRepository: jest.Mocked<IUserRepository> = {
    create: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  }
  
  const mockHashProvider: jest.Mocked<IHashProvider> = {
    compareHash: jest.fn(),
    generateHash: jest.fn()
  }

  beforeEach(() => {
    createUserService = new CreateUserService(
      mockUserRepository as any,
      mockHashProvider as any
    );
  });
  it('Email found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({email: 'felipepe@gmail.com'})

    await expect(
      createUserService.execute({
        email: 'felipepe@gmail.com' 
      })
    ).rejects.toThrow(new AppError('Endereço de email já cadastrado'))
  })

  it('Name not request', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null)

    await expect(
      createUserService.execute({
        email: 'felipepe@gmail.com'
      })
    ).rejects.toThrow(new AppError('Informe seu nome'))
  })

  it('Password not request', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null)

    await expect(
      createUserService.execute({
        email: 'felipepe@gmail.com',
        fullName: 'Felipe'
      })
    ).rejects.toThrow(new AppError('Informe uma senha'))
  })

  it('Password hashed', async () => {
    const password = '1234567890'
    mockUserRepository.findByEmail.mockResolvedValue(null)
    mockHashProvider.generateHash.mockResolvedValue('Reservado123')
    await createUserService.execute({
        email: 'felipepe@gmail.com',
        fullName: 'Felipe',
        password
      })

    expect(mockHashProvider.generateHash).toHaveBeenCalledWith(password);
    expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      email: 'felipepe@gmail.com',
      fullName: 'Felipe',
      password: 'Reservado123' 
    }));
  
    
  })

});
