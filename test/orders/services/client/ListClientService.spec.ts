import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import ListClientService from '@modules/clients/services/ListClientService';
import ClientRepository from '@modules/clients/infra/typeorm/repositories/ClientRepository';

describe('ListClientService', () => {
  let listClientService: ListClientService;
  const mockClientRepository: jest.Mocked<ClientRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as jest.Mocked<ClientRepository>;

  beforeEach(() => {
    listClientService = new ListClientService(mockClientRepository);
  });
  it('should throw an error if page is negative', async () => {
    mockClientRepository.findAll.mockResolvedValue({
      data: [
        {
          id: '1',
          fullname: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: new Date(),
          deletedAt: null,
        },
      ],
      total: 1,
      page: 1,
      size: 10,
    });

    await expect(
      listClientService.execute({
        page: '-1',
        size: '10',
      })
    ).rejects.toThrow(new AppError('O parâmetro \"page\" deve ser um número positivo.'));
  });

  it('should throw an error if size is negative', async () => {
    mockClientRepository.findAll.mockResolvedValue({
      data: [
        {
          id: '1',
          fullname: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: new Date(),
          deletedAt: null,
        },
      ],
      total: 1,
      page: 1,
      size: 10,
    });

    await expect(
      listClientService.execute({
        page: '1',
        size: '-10',
      })
    ).rejects.toThrow(new AppError('O parâmetro \"size\" deve ser um número positivo.'));
  });

  it('should list clients with pagination and no filters', async () => {
    mockClientRepository.findAll.mockResolvedValue({
      data: [
        {
          id: '1',
          fullname: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: new Date(),
          deletedAt: null,
        },
      ],
      total: 1,
      page: 1,
      size: 10,
    });

    const result = await listClientService.execute({
      page: '1',
      size: '10',
    });

    expect(result).toEqual({
      data: [
        {
          id: '1',
          fullname: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: expect.any(Date),
          deletedAt: null,
        },
      ],
      totalClients: 1,
      quant_pages: 1,
      current_page: 1,
    });

    expect(mockClientRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      size: 10,
      fullname: undefined,
      email: undefined,
      excluded: undefined,
      orderBy: undefined,
    });
  });

  it('should apply filters when listing clients', async () => {
    mockClientRepository.findAll.mockResolvedValue({
      data: [
        {
          id: '2',
          fullname: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: new Date(),
          deletedAt: null,
        },
      ],
      total: 1,
      page: 1,
      size: 5,
    });

    const result = await listClientService.execute({
      page: '1',
      size: '5',
      name: 'Raimundo nonato',
      email: 'ninguemliga@example.com',
    });

    expect(result).toEqual({
      data: [
        {
          id: '2',
          fullname: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: expect.any(Date),
          deletedAt: null,
        },
      ],
      totalClients: 1,
      quant_pages: 1,
      current_page: 1,
    });

    expect(mockClientRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      size: 5,
      fullname: 'Raimundo nonato',
      email: 'ninguemliga@example.com',
      excluded: undefined,
      orderBy: undefined,
    });
  });

  it('should throw an error if no clients are found', async () => {
    mockClientRepository.findAll.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      size: 10,
    });

    await expect(
      listClientService.execute({
        page: '1',
        size: '10',
      })
    ).rejects.toThrow(new AppError('Nenhum cliente encontrado.'));
  });

  it('should handle sorting clients by allowed fields', async () => {
    mockClientRepository.findAll.mockResolvedValue({
      data: [
        {
          id: '3',
          fullname: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: new Date(),
          deletedAt: null,
        },
      ],
      total: 1,
      page: 1,
      size: 10,
    });

    const result = await listClientService.execute({
      page: '1',
      size: '10',
      orderBy: ['fullname', 'createdAt'],
    });

    expect(result).toEqual({
      data: [
        {
          id: '3',
          fullname: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: expect.any(Date),
          deletedAt: null,
        },
      ],
      totalClients: 1,
      quant_pages: 1,
      current_page: 1,
    });

    expect(mockClientRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      size: 10,
      fullname: undefined,
      email: undefined,
      excluded: undefined,
      orderBy: ['fullname', 'createdAt'],
    });
  });

  it('should handle excluded clients filter', async () => {
    mockClientRepository.findAll.mockResolvedValue({
      data: [
        {
          id: '4',
          fullname: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: new Date(),
          deletedAt: new Date(),
        },
      ],
      total: 1,
      page: 1,
      size: 10,
    });

    const result = await listClientService.execute({
      page: '1',
      size: '10',
      excluded: 'true',
    });

    expect(result).toEqual({
      data: [
        {
          id: '4',
          fullname: 'Raimundo nonato',
          email: 'ninguemliga@example.com',
          createdAt: expect.any(Date),
          deletedAt: expect.any(Date),
        },
      ],
      totalClients: 1,
      quant_pages: 1,
      current_page: 1,
    });

    expect(mockClientRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      size: 10,
      fullname: undefined,
      email: undefined,
      excluded: true,
      orderBy: undefined,
    });
  });
});
