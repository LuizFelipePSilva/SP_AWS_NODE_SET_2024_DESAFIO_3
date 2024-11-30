import "reflect-metadata";
import CreateSessionService from "@modules/users/services/CreateSession";
import { IUserRepository } from "@modules/users/domain/repositories/IUserRepository";
import { IHashProvider } from "@modules/users/providers/HashProvider/models/IHashProvider";
import AppError from "@shared/errors/AppError";
import { sign } from "jsonwebtoken";
import auth from "@config/auth";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn()
}));


describe("CreateUserService", () => {
  let createSessionUserService: CreateSessionService;

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
    createSessionUserService = new CreateSessionService(
      mockUserRepository as any,
      mockHashProvider as any
    );
  });

  it('user not found id', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null)

   await expect( 
      createSessionUserService.execute({
        email: 'felipepe@gmail.com'
      })
    ).rejects.toThrow(new AppError('Incorrect email/password combination.', 401))
  })

  it('Password wrong', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(
      {
        id: '1', 
        email: 'felipepe@gmail.com', 
        password: 'generateHash'
      }
    )
    mockHashProvider.compareHash.mockResolvedValue(false)

   await expect( 
      createSessionUserService.execute({
        email: 'felipepe@gmail.com',
        password: 'wrongHash'
      })
    ).rejects.toThrow(new AppError('Incorrect email/password combination.', 401))
  })
  it('should successfully authenticate and return token', async () => {
    const user = { id: '1', email: 'felipepe@gmail.com', password: 'hashedpassword' };
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockHashProvider.compareHash.mockResolvedValue(true); // Senha confirmada

    // Mocking JWT token creation
    const mockToken = 'mocked.jwt.token';
    (sign as jest.Mock).mockReturnValue(mockToken);

    const result = await createSessionUserService.execute({
      email: 'felipepe@gmail.com',
      password: '123456',
    });

    expect(result).toEqual({
      user,
      token: mockToken,
    });

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('felipepe@gmail.com');
    expect(mockHashProvider.compareHash).toHaveBeenCalledWith('123456', user.password);
    expect(sign).toHaveBeenCalledWith(
      {}, 
      auth.jwt.secret, 
      { subject: user.id, expiresIn: auth.jwt.expiresIn }
    );
  });


});
