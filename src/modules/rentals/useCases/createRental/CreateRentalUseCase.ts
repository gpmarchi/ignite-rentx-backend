import { inject, injectable } from 'tsyringe';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  private rentalsRepository: IRentalsRepository;
  private dateProvider: IDateProvider;

  constructor(
    @inject('RentalsRepository')
    rentalsRepository: IRentalsRepository,
    @inject('DayjsDateProvider')
    dateProvider: IDateProvider,
  ) {
    this.rentalsRepository = rentalsRepository;
    this.dateProvider = dateProvider;
  }

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const carRental = await this.rentalsRepository.findOpenRentalByCar(car_id);

    if (carRental) {
      throw new AppError('Car is unavailable.');
    }

    const userRental = await this.rentalsRepository.findOpenRentalByUser(
      user_id,
    );

    if (userRental) {
      throw new AppError('User already has an open rental.');
    }

    const dateNow = this.dateProvider.dateNow();

    const compare = this.dateProvider.compareInHours(
      dateNow,
      expected_return_date,
    );

    const minimumRentalPeriod = 24;

    if (compare < minimumRentalPeriod) {
      throw new AppError('Rental period must be at least 24 hours.');
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };
