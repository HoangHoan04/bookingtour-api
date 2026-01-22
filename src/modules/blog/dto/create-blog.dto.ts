import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ description: 'Tiêu đề bài viết' })
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'URL slug' })
  @IsString()
  @IsNotEmpty({ message: 'Slug không được để trống' })
  @MaxLength(255)
  slug: string;

  @ApiProperty({ description: 'Tóm tắt ngắn', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiProperty({ description: 'Nội dung đầy đủ (HTML/Markdown)' })
  @IsString()
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  content: string;

  @ApiProperty({ description: 'Ảnh đại diện bài viết', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  featuredImage?: string;

  @ApiProperty({ description: 'Danh mục bài viết', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiProperty({ description: 'Tags bài viết', required: false })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Tiêu đề SEO', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  seoTitle?: string;

  @ApiProperty({ description: 'Mô tả SEO', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @ApiProperty({ description: 'Thời gian xuất bản', required: false })
  @IsOptional()
  publishedAt?: Date;
}
