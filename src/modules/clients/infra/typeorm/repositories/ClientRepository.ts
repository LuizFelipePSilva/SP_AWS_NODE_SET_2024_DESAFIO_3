import { getRepository, Repository } from 'typeorm';
import Client from '../entities/Client';
import { IClientRepository } from '@modules/clients/domain/repositories/IClientRepository';
import { IClient } from '@modules/clients/domain/models/IClient';
import { ICreateClient } from '@modules/clients/domain/models/ICreateClient';
import { IShowClientParams } from '@modules/clients/domain/models/IShowClientParams';
import { IClientPaginate } from '@modules/clients/domain/models/IClientPaginate';

interface IFindAllParams {
  page: number;
  size: number;
  fullname?: string;
  email?: string;
  excluded?: boolean;
  orderBy?: string[];
}

class ClientRepository implements IClientRepository {
  [x: string]: any;

  private ormRepository: Repository<Client>;

  constructor() {
    this.ormRepository = getRepository(Client);
  }

  public async create({
    fullName,
    birthDate,
    cpf,
    email,
    phone,
  }: ICreateClient): Promise<Client> {
    const client = this.ormRepository.create({
      fullName,
      birthDate,
      cpf,
      email,
      phone,
    });

    await this.ormRepository.save(client);

    return client;
  }

  public async save(client: Client): Promise<Client> {
    await this.ormRepository.save(client);

    return client;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  public async findByName(fullName: string): Promise<Client | undefined> {
    return this.ormRepository.findOne({
      where: {
        fullName,
      },
    });
  }

  public async findById(id: string): Promise<Client | undefined> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async findByEmail(email: string): Promise<Client | undefined> {
    return this.ormRepository.findOne({
      where: {
        email,
      },
    });
  }

  public async findByCPF(cpf: string): Promise<Client | undefined> {
    return this.ormRepository.findOne({
      where: {
        cpf,
      },
    });
  }

  public async findByPhone(phone: string): Promise<Client | undefined> {
    return this.ormRepository.findOne({
      where: {
        phone,
      },
    });
  }

  public async findAll(params: IFindAllParams) {
    const { page, size, fullname, email, excluded, orderBy } = params;

    const query = this.createQueryBuilder('client')
      .skip((page - 1) * size)
      .take(size);

    if (fullname) {
      query.andWhere('client.fullname ILIKE :fullname', { fullname: `%${fullname}%` });
    }

    if (email) {
      query.andWhere('client.email ILIKE :email', { email: `%${email}%` });
    }

    if (excluded !== undefined) {
      query.andWhere('client.deletedAt IS NOT NULL = :excluded', { excluded });
    }

    if (orderBy && orderBy.length > 0) {
      orderBy.forEach((field) => {
        query.addOrderBy(`client.${field}`);
      });
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      size,
    };
  }
}

export default ClientRepository;
