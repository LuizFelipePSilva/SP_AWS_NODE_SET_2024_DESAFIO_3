import { inject, injectable } from 'tsyringe';
import ClientRepository from '../infra/typeorm/repositories/ClientRepository';
import { IClientPaginate } from '../domain/models/IClientPaginate';
import AppError from '@shared/errors/AppError';

interface IListClientQueryParams {
  page?: string;
  size?: string;
  name?: string;
  email?: string;
  excluded?: string;
  orderBy?: string[];
}

@injectable()
class ListClientService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: ClientRepository
  ) {}

  public async execute(query: IListClientQueryParams): Promise<IClientPaginate> {
    const {
      page = 1,
      size = 10,
      name,
      email,
      excluded,
      orderBy,
    } = query;

    const pageNumber = Number(page);
    const pageSize = Number(size);

    if (isNaN(pageNumber) || pageNumber <= 0) {
      throw new AppError('O parâmetro "page" deve ser um número positivo.');
    }

    if (isNaN(pageSize) || pageSize <= 0) {
      throw new AppError('O parâmetro "size" deve ser um número positivo.');
    }

    const isExcluded = excluded ? excluded === 'true' : undefined;

    const allowedOrderFields = ['fullname', 'createdAt', 'deletedAt'] as const;
    const orderFields = orderBy
      ? (orderBy.filter((field) =>
          allowedOrderFields.includes(field as typeof allowedOrderFields[number])
        ) as typeof allowedOrderFields[number][])
      : undefined;

    const result = await this.clientRepository.findAll({
      page: pageNumber,
      size: pageSize,
      fullname: name,
      email,
      excluded: isExcluded,
      orderBy: orderFields,
    });

    if (result.data.length === 0) {
      throw new AppError('Nenhum cliente encontrado.');
    }

    const quant_pages = Math.ceil(result.total / pageSize);
    const totalClients = result.total;
    const current_page = pageNumber;

    return {
      data: result.data,
      totalClients,
      quant_pages,
      current_page,
    };
  }
}

export default ListClientService;
