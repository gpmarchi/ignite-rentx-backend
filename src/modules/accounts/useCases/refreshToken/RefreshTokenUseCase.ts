import { verify, sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokenRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  private usersTokensRepository;

  private dateProvider;

  constructor(
    @inject('UsersTokensRepository')
    usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    dateProvider: IDateProvider,
  ) {
    this.usersTokensRepository = usersTokensRepository;
    this.dateProvider = dateProvider;
  }

  async execute(refresh_token: string): Promise<ITokenResponse> {
    const { sub, email } = verify(
      refresh_token,
      auth.secret_refresh_token,
    ) as IPayload;

    const user_id = sub;

    const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(
      user_id,
      refresh_token,
    );

    if (!userToken) {
      throw new AppError('Refresh token not found.', 404);
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refreshed_token = sign({ email }, auth.secret_refresh_token, {
      subject: user_id,
      expiresIn: auth.expires_in_refresh_token,
    });

    const expires_at = this.dateProvider.addDays(
      auth.expires_in_refresh_token_days,
    );

    await this.usersTokensRepository.create({
      user_id,
      refresh_token: refreshed_token,
      expires_at,
    });

    const newToken = sign({}, auth.secret_token, {
      subject: user_id,
      expiresIn: auth.expires_in_token,
    });

    return {
      token: newToken,
      refresh_token: refreshed_token,
    };
  }
}

export { RefreshTokenUseCase };
