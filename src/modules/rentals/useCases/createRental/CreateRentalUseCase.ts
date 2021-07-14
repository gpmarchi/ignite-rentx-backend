import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { inject, injectable } from 'tsyringe';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { AppError } from '@shared/errors/AppError';

dayjs.extend(utc);

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

// @injectable()
class CreateRentalUseCase {
  private rentalsRepository: IRentalsRepository;

  constructor(
    // @inject('RentalsRepository')
    rentalsRepository: IRentalsRepository,
  ) {
    this.rentalsRepository = rentalsRepository;
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

    const minimumRentalPeriod = 24;

    const expectedReturnDateFormat = dayjs(expected_return_date)
      .utc()
      .local()
      .format();

    const now = dayjs().utc().local().format();

    const compare = dayjs(expectedReturnDateFormat).diff(now, 'hours');

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
