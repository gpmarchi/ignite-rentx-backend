import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { ISpecificationsRepository } from '@modules/cars/repositories/ISpecificationsRepository';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateSpecificationUseCase {
  private specificationsRepository: ISpecificationsRepository;

  constructor(
    @inject('SpecificationsRepository')
    specificationsRepository: ISpecificationsRepository,
  ) {
    this.specificationsRepository = specificationsRepository;
  }

  async execute({ name, description }: IRequest): Promise<void> {
    const specification = await this.specificationsRepository.findByName(name);

    if (specification) {
      throw new AppError('Specification already exists.');
    }

    await this.specificationsRepository.create({ name, description });
  }
}

export { CreateSpecificationUseCase };
