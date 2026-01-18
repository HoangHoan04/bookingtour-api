import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum CommentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class UpdateCommentStatusDto {
  @ApiProperty({
    description: 'Trạng thái bình luận',
    enum: CommentStatus,
    required: true,
  })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsEnum(CommentStatus, { message: 'Trạng thái không hợp lệ' })
  status: CommentStatus;
}
