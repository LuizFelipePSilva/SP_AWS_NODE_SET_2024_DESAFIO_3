import "reflect-metadata";
import FindUserByIdService from "@modules/users/services/FindUserById";
import { IUserRepository } from "@modules/users/domain/repositories/IUserRepository";
import { IHashProvider } from "@modules/users/providers/HashProvider/models/IHashProvider";
import AppError from "@shared/errors/AppError";


describe("CreateUserService", () => {
  let findUserService: FindUserByIdService;

  const mockUserRepository: jest.Mocked<IUserRepository> = {
    create: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  }
  

  beforeEach(() => {
    findUserService = new FindUserByIdService(
      mockUserRepository as any,
    );
  });

  it('user not found id', async () => {
    mockUserRepository.findById.mockResolvedValue(null)

   await expect(
      findUserService.execute({
        id: '1'
      })
    ).rejects.toThrow(new AppError('Usuário não encontrado'))
  })

  it('user found id', async () => {
    mockUserRepository.findById.mockResolvedValue({id: '1'})

   const result = await findUserService.execute({id: '1'})

    expect(result).toEqual({
      id: '1'
    })
   expect(mockUserRepository.findById).toHaveBeenCalledWith('1')
    
  })  

});
