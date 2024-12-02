import "reflect-metadata";
import UpdateUserService from "@modules/users/services/UpdateUser";
import { IUserRepository } from "@modules/users/domain/repositories/IUserRepository";
import { IHashProvider } from "@modules/users/providers/HashProvider/models/IHashProvider";
import AppError from "@shared/errors/AppError";


describe("UpdateUserService", () => {
  let updateUserService: UpdateUserService;

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
    updateUserService = new UpdateUserService(
      mockUserRepository as any,
      mockHashProvider as any,
    );
  });

  it('should throw error if id not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null)

   await expect(
    updateUserService.execute({
        id: '1'
      })
    ).rejects.toThrow(new AppError('Usuário não encontrado'))
  })

  it('should throw error if email already used', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({email: "felipepe@gmail.com"})
    mockUserRepository.findById.mockResolvedValue({id: '1'})

   await expect(
    updateUserService.execute({
        id: '1',
        email: 'felipepe@gmail.com'
      })
    ).rejects.toThrow(new AppError('Endereço de email em uso'))
  })

  it('should update user successfully', async () => {
    const password = 'password'
    mockUserRepository.findByEmail.mockResolvedValue(null)
    mockUserRepository.findById.mockResolvedValue({id: '1'})
    mockHashProvider.generateHash.mockResolvedValue('Reservado123')

      await updateUserService.execute({
        id: '1',
        email: 'felipepe@gmail.com',
        fullName: 'Luiz Felipe',
        password
      })

      expect(mockHashProvider.generateHash).toHaveBeenCalledWith(password);
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        email: 'felipepe@gmail.com',
        fullName: 'Luiz Felipe',
        password: 'Reservado123' 
      }));  
  })
});
