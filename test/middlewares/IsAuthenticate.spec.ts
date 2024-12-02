import { NextFunction, Request, Response } from "express";
import isAuthenticate from "@shared/infra/http/middlewares/isAuthenticated";
import { verify } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('isAuthenticate Middleware', () => {
  it('should call next if the token is valid', () => {
    const req = {
      headers: {
        authorization: 'Bearer validToken',
      },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    (verify as jest.Mock).mockImplementation(() => ({
      sub: 'user-id',
    }));

    isAuthenticate(req, res, next);

    expect(verify).toHaveBeenCalledWith('validToken', undefined);
    expect(req.user).toEqual({ id: 'user-id' });
    expect(next).toHaveBeenCalled();
  });

  it('should throw an error if no token is provided', () => {
    const req = {
      headers: {},
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();
    //tive que usar try-catch, infelizmente
    try {
      isAuthenticate(req, res, next);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).message).toBe('JWT Token is missed');
    }
  });

  it('should throw an error if the token is invalid', () => {
    const req = {
      headers: {
        authorization: 'Bearer invalidToken',
      },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    (verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid Token');
    });

    try {
      isAuthenticate(req, res, next);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).message).toBe('Invalid JWT Token');
    }
  });
});
