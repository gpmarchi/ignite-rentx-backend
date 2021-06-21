import { inject, injectable } from 'tsyringe';

import { ICategoriesRepository } from '@modules/cars/repositories/ICategoriesRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateCategoryUseCase {
  private categoriesRepository: ICategoriesRepository;

  constructor(
    @inject('CategoriesRepository')
    categoriesRepository: ICategoriesRepository,
  ) {
    this.categoriesRepository = categoriesRepository;
  }

  async execute({ name, description }: IRequest): Promise<void> {
    const category = await this.categoriesRepository.findByName(name);

    if (category) {
      throw new AppError('Category already exists.');
    }

    this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryUseCase };
