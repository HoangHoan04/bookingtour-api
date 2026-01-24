import {
  CustomerEntity,
  TourGuideEntity,
  UserEntity,
  VerifyOtpEntity,
} from 'src/entities/user';
import { CustomRepository } from 'src/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}

@CustomRepository(CustomerEntity)
export class CustomerRepository extends Repository<CustomerEntity> {}

@CustomRepository(VerifyOtpEntity)
export class VerifyOtpRepository extends Repository<VerifyOtpEntity> {}

@CustomRepository(TourGuideEntity)
export class TourGuideRepository extends Repository<TourGuideEntity> {}
