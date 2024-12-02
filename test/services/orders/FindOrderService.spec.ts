import 'reflect-metadata';
import { IOrderRepository } from '@modules/orders/domain/repositories/IOrderRepository';
import ListOrderService from '@modules/orders/services/FindOrder';
import AppError from '@shared/errors/AppError';

describe('ListOrderService', () => {
  let listOrderService: ListOrderService;
  const mockOrderRepository: jest.Mocked<IOrderRepository> = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findByClient: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    listOrderService = new ListOrderService(mockOrderRepository);
  });

  it('should list orders with pagination and no filters', async () => {
    mockOrderRepository.findAll.mockResolvedValue({
      data: [
        {
          id: '1',
          clientCpf: '12345678901',
          status: 'Aberto',
          orderDate: new Date(),
        },
      ],
      per_page: 10,
      total: 1,
      current_page: 1,
    });

    const result = await listOrderService.execute({
      page: 1,
      limit: 10,
    });

    expect(result).toEqual({
      per_page: 10,
      data: [
        {
          id: '1',
          clientCpf: '12345678901',
          status: 'Aberto',
          orderDate: expect.any(Date),
        },
      ],
      total: 1,
      current_page: 1,
      last_page: 1,
    });

    expect(mockOrderRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      skip: 0,
      take: 10,
      order: { orderDate: 'DESC' },
      filters: {},
    });
  });

  it('should apply filters when listing orders', async () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    mockOrderRepository.findAll.mockResolvedValue({
      data: [
        {
          id: '2',
          clientCpf: '98765432101',
          status: 'Fechado',
          orderDate: new Date('2024-01-15'),
        },
      ],
      per_page: 5,
      total: 1,
      current_page: 1,
    });

    const result = await listOrderService.execute({
      page: 1,
      limit: 5,
      status: 'Fechado',
      cpf: '98765432101',
      startDate,
      endDate,
    });

    expect(result).toEqual({
      per_page: 5,
      data: [
        {
          id: '2',
          clientCpf: '98765432101',
          status: 'Fechado',
          orderDate: expect.any(Date),
        },
      ],
      total: 1,
      current_page: 1,
      last_page: 1,
    });

    expect(mockOrderRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      skip: 0,
      take: 5,
      order: { orderDate: 'DESC' },
      filters: {
        status: 'Fechado',
        clientCpf: '98765432101',
        orderDateRange: { start: startDate, end: endDate },
      },
    });
  });

  it('should throw an error if no orders are found', async () => {
    mockOrderRepository.findAll.mockResolvedValue({
      data: [],
      per_page: 10,
      total: 0,
      current_page: 1,
    });

    await expect(
      listOrderService.execute({
        page: 1,
        limit: 10,
      })
    ).rejects.toThrow(new AppError('No orders found.'));
  });

  it('should handle date range with only startDate', async () => {
    const startDate = new Date('2024-01-01');

    mockOrderRepository.findAll.mockResolvedValue({
      data: [
        {
          id: '3',
          clientCpf: '12312312399',
          status: 'Aberto',
          orderDate: new Date('2024-01-05'),
        },
      ],
      per_page: 10,
      total: 1,
      current_page: 1,
    });

    const result = await listOrderService.execute({
      page: 1,
      limit: 10,
      startDate,
    });

    expect(mockOrderRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      skip: 0,
      take: 10,
      order: { orderDate: 'DESC' },
      filters: {
        orderDate: { $gte: startDate },
      },
    });

    expect(result.data.length).toBe(1);
  });

  it('should handle date range with only endDate', async () => {
    const endDate = new Date('2024-01-31');

    mockOrderRepository.findAll.mockResolvedValue({
      data: [
        {
          id: '4',
          clientCpf: '55555555555',
          status: 'Fechado',
          orderDate: new Date('2024-01-25'),
        },
      ],
      per_page: 10,
      total: 1,
      current_page: 1,
    });

    const result = await listOrderService.execute({
      page: 1,
      limit: 10,
      endDate,
    });

    expect(mockOrderRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      skip: 0,
      take: 10,
      order: { orderDate: 'DESC' },
      filters: {
        orderDate: { $lte: endDate },
      },
    });

    expect(result.data[0].id).toBe('4');
  });
});
