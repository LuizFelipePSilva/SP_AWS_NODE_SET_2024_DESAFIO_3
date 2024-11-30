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

    it('Order not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);
  
      await expect(
        updateOrderService.execute({id: '1'})
      ).rejects.toThrow(new AppError('Order not found.', 400))
    })

    it('Order update date not grandiest for atual date', async () => {
    mockOrderRepository.findById.mockResolvedValue({id: '1', orderDate: new Date('2024-01-10')});
    await expect(
      updateOrderService.execute({id:'1', orderDate: new Date('2023-01-10')})
    ).rejects.toThrow(new AppError('Data Hora Inicial não pode ser menor que hoje.'))
    })

    it('Order update Purchase date', async () => {
      mockOrderRepository.findById.mockResolvedValue({id: '1', orderDate: new Date('2024-01-10')});
      await expect(
        updateOrderService.execute({
          id:'1', 
          orderDate: new Date('2030-11-29'), 
          purchaseDate: new Date('2023-01-01')
        })
      ).rejects.toThrow(new AppError('Data Hora Final não pode ser menor que Data Hora Inicial.'))
      });

    it('deve lançar um erro se o CEP não for encontrado', async () => {
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


    it('ksadkasd', async () => {
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

    it('Order status to cancelado', async () => {
      mockOrderRepository.findById.mockResolvedValue({id: '1', status: "Aprovado"});
      await expect(
        updateOrderService.execute({
          id:'1',
          status: "Cancelado" 
        })
      ).rejects.toThrow(new AppError('Apenas pedidos abertos podem ser cancelados.'))
      }); 

    it('Order status to Aprovado', async () => {
        mockOrderRepository.findById.mockResolvedValue({id: '1', status: "Aprovado"});
        await expect(
          updateOrderService.execute({
            id:'1',
            status: "Aprovado" 
          })
        ).rejects.toThrow(new AppError('Apenas pedidos abertos podem ser aprovados.'))
      })
      it('Update order', async () => {
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
      it('Order status to Aprovado', async () => {
        mockOrderRepository.findById.mockResolvedValue({id: '1', status: "Aprovado"});
        await expect(
          updateOrderService.execute({
            id:'1',
            status: "Aprovado" 
          })
        ).rejects.toThrow(new AppError('Apenas pedidos abertos podem ser aprovados.'))
      })
      it('Update order', async () => {
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
