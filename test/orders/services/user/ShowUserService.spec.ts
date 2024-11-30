import 'reflect-metadata';
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';
import ListUsersService from '@modules/users/services/ShowUsers';
import AppError from '@shared/errors/AppError';

describe('ListUsersService', () => {
  let listUsersService: ListUsersService;
  const mockUserRepository: jest.Mocked<IUserRepository> = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findByEmail: jest.fn()
  };

  beforeEach(() => {
    listUsersService = new ListUsersService(mockUserRepository);
  });

  it('should list users with pagination and no filters', async () => {
    mockUserRepository.findAll.mockResolvedValue({
      data: [
        {
          id: '1',
          name: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: new Date(),
          deletedAt: null,
        },
      ],
      per_page: 10,
      total: 1,
      current_page: 1,
    });

    const result = await listUsersService.execute({
      page: 1,
      size: 10,
    });

    expect(result).toEqual({
      per_page: 10,
      data: [
        {
          id: '1',
          name: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: expect.any(Date),
          deletedAt: null,
        },
      ],
      total: 1,
      current_page: 1,
    });

    expect(mockUserRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      size: 10,
      name: undefined,
      email: undefined,
      excluded: undefined,
      orderBy: undefined,
    });
  });

  it('should apply filters when listing users', async () => {
    mockUserRepository.findAll.mockResolvedValue({
      data: [
        {
          id: '2',
          name: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: new Date('2024-01-15'),
          deletedAt: null,
        },
      ],
      per_page: 5,
      total: 1,
      current_page: 1,
    });
  
    const result = await listUsersService.execute({
      page: 1,
      size: 5,
      name: 'Raimundo nonato',
      email: 'ninguemliga@example.com',
      excluded: false,
    });
  
    expect(result).toEqual({
      per_page: 5,
      data: [
        {
          id: '2',
          name: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: expect.any(Date),
          deletedAt: null,
        },
      ],
      total: 1,
      current_page: 1,
    });
  
    // Valida apenas a chamada com os filtros aplicados
    expect(mockUserRepository.findAll).toHaveBeenLastCalledWith({
      page: 1,
      size: 5,
      name: 'Raimundo nonato',
      email: 'ninguemliga@example.com',
      excluded: undefined,
      orderBy: undefined,
    });
  });

  it('should throw an error if no users are found', async () => {
    mockUserRepository.findAll.mockResolvedValue({
      data: [],
      per_page: 10,
      total: 0,
      current_page: 1,
    });

    await expect(
      listUsersService.execute({
        page: 1,
        size: 10,
      })
    ).rejects.toThrow(new AppError('Nenhum usuário encontrado'));
  });

  it('should apply orderBy fields', async () => {
    mockUserRepository.findAll.mockResolvedValue({
      data: [
        {
          id: '3',
          name: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: new Date('2024-01-01'),
          deletedAt: null,
        },
      ],
      per_page: 10,
      total: 1,
      current_page: 1,
    });

    const result = await listUsersService.execute({
      page: 1,
      size: 10,
      orderBy: ['name', 'createdAt'],
    });

    expect(mockUserRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      size: 10,
      name: undefined,
      email: undefined,
      excluded: undefined,
      orderBy: ['name', 'createdAt'],
    });

    expect(result.data[0].name).toBe('Raimundo nonato');
  });
});
