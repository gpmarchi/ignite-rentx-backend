import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '../../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  private usersRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
  ) {
    this.usersRepository = usersRepository;
  }

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new Error('Email or password incorrect.');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Email or password incorrect.');
    }

    const token = sign({}, '8099cbee84dec6e29d68d985c06601f8', {
      subject: user.id,
      expiresIn: '1d',
    });

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}

export { AuthenticateUserUseCase };
