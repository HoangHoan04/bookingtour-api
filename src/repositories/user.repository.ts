import { UserEntity } from 'src/entities';
import { VerifyOtpEntity } from 'src/entities/user';
import { CustomerEntity } from 'src/entities/user/customer.entity';
import { CustomRepository } from 'src/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}

@CustomRepository(CustomerEntity)
export class CustomerRepository extends Repository<CustomerEntity> {}

@CustomRepository(VerifyOtpEntity)
export class VerifyOtpRepository extends Repository<VerifyOtpEntity> {}
