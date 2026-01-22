import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ description: 'Tiêu đề bài viết' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'URL slug' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiProperty({ description: 'Tóm tắt ngắn' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiProperty({ description: 'Nội dung đầy đủ (HTML/Markdown)' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Ảnh đại diện bài viết' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  featuredImage?: string;

  @ApiProperty({ description: 'Danh mục bài viết' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiProperty({ description: 'Tags bài viết' })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Tiêu đề SEO' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  seoTitle?: string;

  @ApiProperty({ description: 'Mô tả SEO' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @ApiProperty({ description: 'Thời gian xuất bản' })
  @IsOptional()
  publishedAt?: Date;
}
