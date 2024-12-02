import "reflect-metadata";
import SoftDeleteUserService from "@modules/users/services/SoftDeleteUser";
import { IUserRepository } from "@modules/users/domain/repositories/IUserRepository";
import { IHashProvider } from "@modules/users/providers/HashProvider/models/IHashProvider";
import AppError from "@shared/errors/AppError";


describe("DeleteUserService", () => {
  let softDeleteUserService: SoftDeleteUserService;

  const mockUserRepository: jest.Mocked<IUserRepository> = {
    create: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  }
  

  beforeEach(() => {
    softDeleteUserService = new SoftDeleteUserService(
      mockUserRepository as any,
    );
  });

  it('should throw error if id not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null)

   await expect(
      softDeleteUserService.execute({
        id: '1'
      })
    ).rejects.toThrow(new AppError('Usuário não encontrado'))
  })

  it('should find user successfully', async () => { 
    mockUserRepository.findById.mockResolvedValue({id: '1'})

   const result = await softDeleteUserService.execute({id: '1'})

    expect(result).toEqual({
      id: '1'
    })
   expect(mockUserRepository.findById).toHaveBeenCalledWith('1')
    
  })  

});
