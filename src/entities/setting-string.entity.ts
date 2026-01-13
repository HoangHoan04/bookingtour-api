import { Column, Entity } from 'typeorm';
import { enumData } from '../constants';
import { BaseEntity } from './base.entity';

/** cấu hình động */
@Entity('setting_string')
export class SettingStringEntity extends BaseEntity {
  /** Mã cấu hình */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  code: string;

  /** Tên cấu hình */
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  name: string;

  /** loại dữ liệu */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: enumData.DataType.string.code,
  })
  type: string;

  /** giá trị cấu hình  động */
  @Column({
    type: 'float',
    nullable: true,
  })
  value: number;

  /** Giá trị chữ */
  @Column({
    type: 'text',
    nullable: true,
  })
  valueString: string;
}
