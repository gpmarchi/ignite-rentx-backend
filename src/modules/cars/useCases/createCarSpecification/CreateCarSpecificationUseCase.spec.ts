import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create car specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
    );
  });

  it('should be able to add a new specification to a car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car name',
      description: 'Description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'categoryId',
    });

    const specifications_ids = ['54321'];

    await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_ids,
    });
  });

  it('should not be able to add specification to nonexistent car', async () => {
    const car_id = '1234';
    const specifications_ids = ['54321'];

    await expect(
      createCarSpecificationUseCase.execute({
        car_id,
        specifications_ids,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
