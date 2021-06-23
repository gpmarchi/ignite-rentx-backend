import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

let carsRepository: CarsRepositoryInMemory;
let createCar: CreateCarUseCase;

describe('Create car', () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    createCar = new CreateCarUseCase(carsRepository);
  });

  it('should be able to create a new car', async () => {
    const car = await createCar.execute({
      name: 'Car name',
      description: 'Description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'categoryId',
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be able to create a car with already existing plates', async () => {
    await createCar.execute({
      name: 'Car name',
      description: 'Description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'categoryId',
    });

    await expect(
      createCar.execute({
        name: 'Car name',
        description: 'Description',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'Brand',
        category_id: 'categoryId',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a car with availability activated by default', async () => {
    const car = await createCar.execute({
      name: 'Car name',
      description: 'Description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'categoryId',
    });

    expect(car.available).toBe(true);
  });
});
