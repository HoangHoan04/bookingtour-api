import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UploadFileEntity } from '../upload_file.entity';
import { TransferEmployeeDetailEntity } from './transfer-employee-detail.entity';
import { TransferEmployeeHistoryEntity } from './transfer-employee-history.entity';

@Entity('transfer_employee')
export class TransferEmployeeEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã quyết định điều chuyển' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: 'Tên quyết định điều chuyển' })
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ description: 'Ngày hiệu lực' })
  @Column({ type: 'timestamptz' })
  effectiveDate: Date;

  @ApiProperty({
    description: 'Trạng thái điều chuyển',
    enum: ['DRAFT', 'APPROVED', 'REJECTED'],
  })
  @Column({ default: 'DRAFT' })
  status: string;

  @ApiProperty({
    description: 'Loại điều chuyển',
    enum: ['PROMOTION', 'ROTATION', 'DEMOTION'],
  })
  @Column()
  type: string;

  @ApiProperty({ description: 'Mô tả' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Ghi chú' })
  @Column({ type: 'text', nullable: true })
  note?: string;

  @ApiProperty({ description: 'Danh sách chi tiết điều chuyển nhân viên' })
  @OneToMany(() => TransferEmployeeDetailEntity, (d) => d.transferEmployee)
  details: Promise<TransferEmployeeDetailEntity[]>;

  @ApiProperty({ description: 'Lịch sử điều chuyển nhân viên' })
  @OneToMany(() => TransferEmployeeHistoryEntity, (h) => h.transferEmployee)
  history: Promise<TransferEmployeeHistoryEntity[]>;

  @ApiProperty({ description: 'Tài liệu đính kèm (Quyết định có chữ ký)' })
  @OneToMany(() => UploadFileEntity, (file) => file.transferEmployee)
  documents: Promise<UploadFileEntity[]>;
}
