import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { CreateCarUseCase } from './CreateCarUseCase';

let carsRepository: CarsRepositoryInMemory;
let createCar: CreateCarUseCase;

describe('Create car', () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    createCar = new CreateCarUseCase(carsRepository);
  });

  it('should be able to create a new car', async () => {
    await createCar.execute({
      name: 'Car name',
      description: 'Description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'categoryId',
    });
  });
});
