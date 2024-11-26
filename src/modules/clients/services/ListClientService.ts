import { getCustomRepository } from 'typeorm';
import { IShowClientParams } from '../domain/models/IShowClientParams';
import { IClientPaginate } from '../domain/models/IClientPaginate';
import ClientRepository from '../infra/typeorm/repositories/ClientRepository';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
@injectable()
class ListClientService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: ClientRepository
  ) {}

  public async execute(params: IShowClientParams): Promise<IClientPaginate> {
    const result = await this.clientRepository.findAll(params);

    if (result.data.length === 0) {
      throw new AppError('Nenhum usuário encontrado');
    }

    return result;
  }
}


export default ListClientService;
