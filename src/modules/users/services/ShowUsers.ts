import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IShowUsersParams } from '../domain/models/IShowUsersParams';
import { IUserPaginate } from '../domain/models/IUserPaginate';
import AppError from '@shared/errors/AppError';

@injectable()
class ListUsersService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository
  ) {}

  public async execute(queryParams: Record<string, any>): Promise<IUserPaginate> {
    const {
      page = 1,
      size = 10,
      name,
      email,
      excluded,
      orderBy,
    } = queryParams;

    const pageNumber = Number(page);
    const pageSize = Number(size);
    const isExcluded = excluded ? excluded === 'true' : undefined;

    const allowedOrderFields = ['name', 'createdAt', 'deletedAt'] as const;
    type OrderField = typeof allowedOrderFields[number];

    const orderFields = orderBy
      ? ((orderBy as string[]).filter((field) =>
          allowedOrderFields.includes(field as OrderField)
        ) as OrderField[])
      : undefined;

    const params: IShowUsersParams = {
      page: pageNumber,
      size: pageSize,
      name: name as string,
      email: email as string,
      excluded: isExcluded,
      orderBy: orderFields,
    };

    const result = await this.userRepository.findAll(params);

    if (result.data.length === 0) {
      throw new AppError('Nenhum usuário encontrado');
    }

    return result;
  }
}

export default ListUsersService;
