import "reflect-metadata";
import { IOrderRepository } from "@modules/orders/domain/repositories/IOrderRepository";
import AppError from "@shared/errors/AppError";
import UpdateOrderService from "@modules/orders/services/UpdateOrderService";
import axios from "axios";
import { jest } from '@jest/globals';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("UpdateOrderService", () => {
  let updateOrderService: UpdateOrderService;

  const mockOrderRepository: jest.Mocked<IOrderRepository> = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findByClient: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    updateOrderService = new UpdateOrderService(
      mockOrderRepository as any
    );
  });

    it('should throw an error if id not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);
  
      await expect(
        updateOrderService.execute({id: '1'})
      ).rejects.toThrow(new AppError('Order not found.', 400))
    })

    it('should throw error if order update date is not the bigger for actual date', async () => {
    mockOrderRepository.findById.mockResolvedValue({id: '1', orderDate: new Date('2024-01-10')});
    await expect(
      updateOrderService.execute({id:'1', orderDate: new Date('2023-01-10')})
    ).rejects.toThrow(new AppError('Data Hora Inicial não pode ser menor que hoje.'))
    })

    it('should throw error if order update purchase date is not the bigger for actual date', async () => {
      mockOrderRepository.findById.mockResolvedValue({id: '1', orderDate: new Date('2024-01-10')});
      await expect(
        updateOrderService.execute({
          id:'1', 
          orderDate: new Date('2030-11-29'), 
          purchaseDate: new Date('2023-01-01')
        })
      ).rejects.toThrow(new AppError('Data Hora Final não pode ser menor que Data Hora Inicial.'))
      });

    it('should throw error if cpf not found', async () => {
      mockedAxios.mockResolvedValue({
        data: {
          erro: true,
        },
      });

      mockOrderRepository.findById.mockResolvedValue({ id: '1' });

      await expect(
        updateOrderService.execute({
          id: '1',
          cep: '12345678',
        })
      ).rejects.toThrow(new AppError('CEP não encontrado.'));
    });


    it('should throw error if not fillials in region', async () => {
      mockedAxios.mockResolvedValue({
        data: {
          uf: 'SP',
          localidade: "São Paulo"
        },
      });

      mockOrderRepository.findById.mockResolvedValue({ id: '1' });

      await expect(
        updateOrderService.execute({
          id: '1',
          cep: '12345678',
        })
      ).rejects.toThrow(new AppError('No momento não temos filiais nessa região.'));
    })

    it('should throw error if order status is aprovado', async () => {
      mockOrderRepository.findById.mockResolvedValue({id: '1', status: "Aprovado"});
      await expect(
        updateOrderService.execute({
          id:'1',
          status: "Cancelado" 
        })
      ).rejects.toThrow(new AppError('Apenas pedidos abertos podem ser cancelados.'))
      }); 

    it('should throw error if order status is aprovado', async () => {
        mockOrderRepository.findById.mockResolvedValue({id: '1', status: "Aprovado"});
        await expect(
          updateOrderService.execute({
            id:'1',
            status: "Aprovado" 
          })
        ).rejects.toThrow(new AppError('Apenas pedidos abertos podem ser aprovados.'))
      })
      it('should update order successfully', async () => {
        mockOrderRepository.findById.mockResolvedValue({
          id: '1',
          status: 'Aberto',
        });
    
        mockedAxios.mockResolvedValue({
          data: {
            localidade: 'Baraúna',
            uf: 'RN',
          },
        });
    
        const result = await updateOrderService.execute({
          id: '1',
          status: 'Aprovado',
          cep: '59695000'
        });
    
        expect(result.status).toBe('Aprovado');
        expect(result.city).toBe('Baraúna');
        expect(result.uf).toBe('RN');
        expect(mockOrderRepository.update).toHaveBeenCalledTimes(1);
      });
      it('should throw error if status not "aberto"', async () => {
        mockOrderRepository.findById.mockResolvedValue({id: '1', status: "Aprovado"});
        await expect(
          updateOrderService.execute({
            id:'1',
            status: "Aprovado" 
          })
        ).rejects.toThrow(new AppError('Apenas pedidos abertos podem ser aprovados.'))
      })
      it('should update client successfully', async () => {
        mockOrderRepository.findById.mockResolvedValue({
          id: '1',
          status: 'Aberto',
        });
    
        mockedAxios.mockResolvedValue({
          data: {
            localidade: 'Baraúna',
            uf: 'RN',
          },
        });
    
        const result = await updateOrderService.execute({
          id: '1',
          status: 'Cancelado',
          cep: '59695000'
        });
    
        expect(result.status).toBe('Cancelado');
        expect(result.city).toBe('Baraúna');
        expect(result.uf).toBe('RN');
        expect(mockOrderRepository.update).toHaveBeenCalledTimes(2);
      });
  });
