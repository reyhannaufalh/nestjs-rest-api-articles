import { HttpException, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';

export class UserService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`User.Register: ${JSON.stringify(request)}`);

    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const totalUsernameWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUsernameWithSameUsername > 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`User.Login: ${JSON.stringify(request)}`);

    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findFirst({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('User or password is invalid', 400);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('User or password is invalid', 400);
    }

    user = await this.prismaService.user.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        token: uuid(),
      },
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }

  async getUser(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
    };
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(`User.Update: ${JSON.stringify(request)}`);

    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    return {
      username: result.username,
      name: result.name,
    };
  }

  async logout(user: User): Promise<UserResponse> {
    const result = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });

    return {
      username: result.username,
      name: result.name,
    };
  }
}
