import { inject } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  id: string;
  user_id: string;
}

class ReturnRentalUseCase {
  private carsRepository: ICarsRepository;
  private rentalsRepository: IRentalsRepository;
  private dateProvider: IDateProvider;

  constructor(
    @inject('RentalsRepository')
    rentalsRepository: IRentalsRepository,
    @inject('CarsRepository')
    carsRepository: ICarsRepository,
    @inject('DayjsDateProvider')
    dateProvider: IDateProvider,
  ) {
    this.rentalsRepository = rentalsRepository;
    this.carsRepository = carsRepository;
    this.dateProvider = dateProvider;
  }

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);

    const minimumDaily = 1;

    if (!rental) {
      throw new AppError('Rental does not exists.');
    }

    const car = await this.carsRepository.findById(rental?.car_id);

    if (!car) {
      throw new AppError('Car does not exists.');
    }

    const dateNow = this.dateProvider.dateNow();

    let daily = this.dateProvider.compareInDays(rental.start_date, dateNow);

    if (daily <= 0) {
      daily = minimumDaily;
    }

    const returnDelayInDays = this.dateProvider.compareInDays(
      dateNow,
      rental.expected_return_date,
    );

    let total = 0;

    if (returnDelayInDays > 0) {
      const fineValue = returnDelayInDays * car.fine_amount;
      total = fineValue;
    }

    total += daily * car.daily_rate;

    rental.end_date = this.dateProvider.dateNow();
    rental.total = total;

    await this.rentalsRepository.create(rental);

    await this.carsRepository.updateAvailability(car.id, true);

    return rental;
  }
}

export { ReturnRentalUseCase };
