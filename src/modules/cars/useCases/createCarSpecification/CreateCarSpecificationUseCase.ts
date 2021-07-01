import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  car_id: string;
  specifications_ids: string[];
}

// @injectable()
class CreateCarSpecificationUseCase {
  private carsRepository: ICarsRepository;

  constructor(
    // @inject('CarsRepository')
    carsRepository: ICarsRepository,
  ) {
    this.carsRepository = carsRepository;
  }

  async execute({ car_id, specifications_ids }: IRequest): Promise<void> {
    const existingCar = await this.carsRepository.findById(car_id);

    if (!existingCar) {
      throw new AppError('Car does not exists.');
    }
  }
}

export { CreateCarSpecificationUseCase };
