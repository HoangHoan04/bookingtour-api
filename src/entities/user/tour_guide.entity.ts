import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FileArchivalEntity } from '../file_archival.entity';
import { ReviewResponseEntity } from '../tours/review_response.entity';
import { TourDetailEntity } from '../tours/tour_details.entity';
import { UserEntity } from './user.entity';

/** Hướng dẫn viên */
@Entity('tour_guides')
export class TourGuideEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã Hướng dẫn viên' })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  code: string;

  @ApiProperty({ description: 'Họ tên hướng dẫn viên' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @ApiProperty({ description: 'Số điện thoại' })
  @Column({ type: 'varchar', length: 25, nullable: false })
  phone: string;

  @ApiProperty({ description: 'Đường dẫn tĩnh' })
  @Column({ type: 'varchar', length: 200, nullable: false, unique: true })
  slug: string;

  @ApiProperty({ description: 'Email' })
  @Column({ type: 'varchar', length: 250, nullable: false, unique: true })
  email: string;

  @ApiProperty({ description: 'Địa chỉ' })
  @Column({ type: 'varchar', length: 250, nullable: true })
  address?: string;

  @ApiProperty({ description: 'Giới tính (MALE, FEMALE)' })
  @Column({ type: 'varchar', length: 10, nullable: true })
  gender?: string;

  @ApiProperty({ description: 'Ngày sinh' })
  @Column({ type: 'timestamptz', nullable: false })
  birthday: Date;

  @ApiProperty({ description: 'Quốc tịch' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  nationality?: string;

  @ApiProperty({ description: 'Số căn cước công dân/CMND' })
  @Column({ type: 'varchar', length: 12, nullable: true, unique: true })
  identityCard?: string;

  @ApiProperty({ description: 'Số hộ chiếu' })
  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  passportNumber?: string;

  @ApiProperty({ description: 'Tiểu sử ngắn' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  shortBio?: string;

  @ApiProperty({ description: 'Tiểu sử đầy đủ' })
  @Column({ type: 'text', nullable: true })
  bio?: string;

  @ApiProperty({
    description: 'Ngôn ngữ hướng dẫn (VD: Vietnamese, English, Chinese)',
  })
  @Column({ type: 'simple-array', nullable: true })
  languages?: string[];

  @ApiProperty({
    description: 'Chuyên môn/Lĩnh vực (VD: Lịch sử, Văn hóa, Ẩm thực)',
  })
  @Column({ type: 'simple-array', nullable: true })
  specialties?: string[];

  @ApiProperty({ description: 'Số năm kinh nghiệm' })
  @Column({ type: 'int', nullable: true, default: 0 })
  yearsOfExperience?: number;

  @ApiProperty({ description: 'Số chứng chỉ hướng dẫn viên' })
  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  licenseNumber?: string;

  @ApiProperty({ description: 'Ngày cấp chứng chỉ' })
  @Column({ type: 'timestamptz', nullable: true })
  licenseIssuedDate?: Date;

  @ApiProperty({ description: 'Ngày hết hạn chứng chỉ' })
  @Column({ type: 'timestamptz', nullable: true })
  licenseExpiryDate?: Date;

  @ApiProperty({ description: 'Cơ quan cấp chứng chỉ' })
  @Column({ type: 'varchar', length: 200, nullable: true })
  licenseIssuedBy?: string;

  @ApiProperty({ description: 'Đánh giá trung bình (1-5 sao)' })
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating?: number;

  @ApiProperty({ description: 'Tổng số đánh giá' })
  @Column({ type: 'int', default: 0 })
  totalReviews?: number;

  @ApiProperty({ description: 'Tổng số tour đã dẫn' })
  @Column({ type: 'int', default: 0 })
  totalToursCompleted?: number;

  @ApiProperty({
    description: 'Trạng thái (ACTIVE, INACTIVE, SUSPENDED, PENDING)',
  })
  @Column({ type: 'varchar', length: 36, nullable: false, default: 'PENDING' })
  status: string;

  @ApiProperty({ description: 'Ghi chú nội bộ' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Lương cơ bản' })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  baseSalary?: number;

  @ApiProperty({ description: 'Phần trăm hoa hồng (%)' })
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    default: 0,
  })
  commissionRate?: number;

  @ApiProperty({ description: 'Ngày bắt đầu làm việc' })
  @Column({ type: 'timestamptz', nullable: true })
  startDate?: Date;

  @ApiProperty({ description: 'Ngày kết thúc làm việc' })
  @Column({ type: 'timestamptz', nullable: true })
  endDate?: Date;

  @ApiProperty({ description: 'Trạng thái sẵn sàng nhận tour' })
  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @ApiProperty({ description: 'Số tài khoản ngân hàng' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  bankAccountNumber?: string;

  @ApiProperty({ description: 'Tên ngân hàng' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankName?: string;

  @ApiProperty({ description: 'Chủ tài khoản' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankAccountName?: string;

  @ApiProperty({ description: 'Ảnh đại diện' })
  @OneToMany(() => FileArchivalEntity, (file) => file.tourGuide)
  avatar: Promise<FileArchivalEntity[]>;

  @ApiProperty({ description: 'Tài khoản người dùng' })
  @OneToOne(() => UserEntity, (user) => user.tourGuide)
  user: Promise<UserEntity>;

  @ApiProperty({ description: 'Danh sách tour được phân công' })
  @OneToMany(() => TourDetailEntity, (tourDetail) => tourDetail.tourGuide)
  tourDetails: Promise<TourDetailEntity[]>;

  @ApiProperty({ description: 'Các phản hồi đánh giá của hướng dẫn viên' })
  @OneToMany(() => ReviewResponseEntity, (response) => response.responder)
  reviewResponses: Promise<ReviewResponseEntity[]>;
}
