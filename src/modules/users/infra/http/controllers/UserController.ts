import { Request, Response } from 'express';
import { container } from 'tsyringe';
import FindUserByIdService from '@modules/users/services/FindUserById';
import ListUsersService from '@modules/users/services/ShowUsers';
import CreateUserService from '@modules/users/services/CreateUser';
import UpdateUserService from '@modules/users/services/UpdateUser';
import SoftDeleteUserService from '@modules/users/services/SoftDeleteUser';
import { instanceToInstance } from 'class-transformer';

export default class UserController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listUsers = container.resolve(ListUsersService);

    const users = await listUsers.execute(request.query);

    return response.json(instanceToInstance(users));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const userById = container.resolve(FindUserByIdService);

    const user = await userById.execute({ id });

    return response.json(instanceToInstance(user));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { fullName, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ fullName, email, password });

    return response.json(instanceToInstance(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { fullName, email, password } = request.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      id,
      fullName,
      email,
      password,
    });

    return response.json(instanceToInstance(instanceToInstance(user)));
  }

  public async softDelete(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { id } = request.params;

    const softDelete = container.resolve(SoftDeleteUserService);
    const user = await softDelete.execute({ id });

    return response.send().status(204);
  }
}
