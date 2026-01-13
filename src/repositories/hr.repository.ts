import {
  BranchEntity,
  BranchPartMasterEntity,
  CareerPathEntity,
  CompanyEntity,
  DepartmentEntity,
  DepartmentTypeEntity,
  EmployeeCertificateEntity,
  EmployeeEducationEntity,
  EmployeeEntity,
  PartEntity,
  PartMasterEntity,
  PartMasterPositionMasterEntity,
  PositionEntity,
  PositionMasterEntity,
  ShiftEntity,
  ShiftMasterEntity,
  TransferEmployeeDetailEntity,
  TransferEmployeeEntity,
  TransferEmployeeHistoryEntity,
  TransferEmployeePositionEntity,
} from 'src/entities/tour';
import { CustomRepository } from 'src/typeorm';
import { Repository } from 'typeorm';
@CustomRepository(BranchPartMasterEntity)
export class BranchPartMasterRepository extends Repository<BranchPartMasterEntity> {}

@CustomRepository(BranchEntity)
export class BranchRepository extends Repository<BranchEntity> {}

@CustomRepository(CareerPathEntity)
export class CareerPathRepository extends Repository<CareerPathEntity> {}

@CustomRepository(CompanyEntity)
export class CompanyRepository extends Repository<CompanyEntity> {}

@CustomRepository(DepartmentTypeEntity)
export class DepartmentTypeRepository extends Repository<DepartmentTypeEntity> {}

@CustomRepository(DepartmentEntity)
export class DepartmentRepository extends Repository<DepartmentEntity> {}

@CustomRepository(EmployeeCertificateEntity)
export class EmployeeCertificateRepository extends Repository<EmployeeCertificateEntity> {}

@CustomRepository(EmployeeEducationEntity)
export class EmployeeEducationRepository extends Repository<EmployeeEducationEntity> {}

@CustomRepository(EmployeeEntity)
export class EmployeeRepository extends Repository<EmployeeEntity> {}

@CustomRepository(PartMasterEntity)
export class PartMasterRepository extends Repository<PartMasterEntity> {}

@CustomRepository(PartMasterPositionMasterEntity)
export class PartMasterPositionMasterRepository extends Repository<PartMasterPositionMasterEntity> {}

@CustomRepository(PartEntity)
export class PartRepository extends Repository<PartEntity> {}

@CustomRepository(PositionMasterEntity)
export class PositionMasterRepository extends Repository<PositionMasterEntity> {}

@CustomRepository(PositionEntity)
export class PositionRepository extends Repository<PositionEntity> {}

@CustomRepository(ShiftMasterEntity)
export class ShiftMasterRepository extends Repository<ShiftMasterEntity> {}

@CustomRepository(ShiftEntity)
export class ShiftRepository extends Repository<ShiftEntity> {}

@CustomRepository(TransferEmployeeDetailEntity)
export class TransferEmployeeDetailRepository extends Repository<TransferEmployeeDetailEntity> {}

@CustomRepository(TransferEmployeeHistoryEntity)
export class TransferEmployeeHistoryRepository extends Repository<TransferEmployeeHistoryEntity> {}

@CustomRepository(TransferEmployeePositionEntity)
export class TransferEmployeePositionRepository extends Repository<TransferEmployeePositionEntity> {}

@CustomRepository(TransferEmployeeEntity)
export class TransferEmployeeRepository extends Repository<TransferEmployeeEntity> {}
