import { inject, injectable } from 'tsyringe';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { ISpecificationsRepository } from '@modules/cars/repositories/ISpecificationsRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  car_id: string;
  specifications_ids: string[];
}

@injectable()
class CreateCarSpecificationUseCase {
  private carsRepository: ICarsRepository;

  private specificationsRepository: ISpecificationsRepository;

  constructor(
    @inject('CarsRepository')
    carsRepository: ICarsRepository,
    @inject('SpecificationsRepository')
    specificationsRepository: ISpecificationsRepository,
  ) {
    this.carsRepository = carsRepository;
    this.specificationsRepository = specificationsRepository;
  }

  async execute({ car_id, specifications_ids }: IRequest): Promise<Car> {
    const existingCar = await this.carsRepository.findById(car_id);

    if (!existingCar) {
      throw new AppError('Car does not exists.');
    }

    const specifications = await this.specificationsRepository.findByIds(
      specifications_ids,
    );

    existingCar.specifications = specifications;

    await this.carsRepository.create(existingCar);

    return existingCar;
  }
}

export { CreateCarSpecificationUseCase };
