import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { enumData } from 'src/common/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { BlogCommentEntity, BlogPostEntity } from 'src/entities';
import { transformKeys } from 'src/helpers';
import { FileArchivalRepository } from 'src/repositories/base.repository';
import {
  BlogCommentRepository,
  BlogPostRepository,
} from 'src/repositories/blog.repository';
import { FindOptionsWhere, ILike, In, IsNull } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { FileArchivalCreateDto } from '../fileArchival/dto';
import { FileArchivalService } from '../fileArchival/fileArchival.service';
import {
  CreateBlogDto,
  CreateCommentDto,
  UpdateBlogDto,
  UpdateCommentDto,
} from './dto';

@Injectable()
export class BlogService {
  constructor(
    private readonly repo: BlogPostRepository,
    private readonly commentRepo: BlogCommentRepository,
    private readonly actionLogService: ActionLogService,
    private readonly fileArchivalService: FileArchivalService,
    private readonly fileArchivalRepo: FileArchivalRepository,
  ) {}

  async findById(id: string) {
    const result = await this.repo.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const data = transformKeys(result);

    return {
      message: 'Tìm kiếm bài viết thành công',
      data,
    };
  }

  async selectBox() {
    const res: any[] = await this.repo.find({
      where: { isDeleted: false },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });
    return res;
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<BlogPostEntity> = {};

    if (data.where.title) whereCon.title = ILike(`%${data.where.title}%`);
    if (data.where.category)
      whereCon.category = ILike(`%${data.where.category}%`);
    if (data.where.status) whereCon.status = ILike(`%${data.where.status}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [blogs, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: {
        author: true,
      },
    });

    return {
      data: blogs,
      total,
    };
  }

  async create(createDto: CreateBlogDto, user: UserDto) {
    const blog = new BlogPostEntity();
    blog.id = uuidv4();
    blog.title = createDto.title;
    blog.slug = createDto.slug;
    blog.excerpt = createDto.excerpt;
    blog.content = createDto.content;
    blog.category = createDto.category;
    blog.tags = createDto.tags;
    blog.status = createDto.status;
    blog.seoTitle = createDto.seoTitle;
    blog.seoDescription = createDto.seoDescription;
    blog.publishedAt = createDto.publishedAt;
    blog.authorId = user.id;
    blog.createdBy = user.id;
    blog.createdAt = new Date();

    await this.repo.insert(blog);

    const featuredImage = Array.isArray(createDto.featuredImage)
      ? createDto.featuredImage[0]
      : createDto.featuredImage;
    if (featuredImage?.fileUrl && featuredImage?.fileName) {
      const fileArchival: FileArchivalCreateDto = {
        fileUrl: featuredImage.fileUrl,
        fileName: featuredImage.fileName,
        fileType: 'BLOG_FEATURED_IMAGE',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        fileRelationName: 'blogPostId',
        fileRelationId: blog.id,
      };
      await this.fileArchivalService.create(fileArchival);
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: blog.id,
      functionType: 'Blog',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới bài viết: ${blog.title}`,
      oldData: '{}',
      newData: JSON.stringify(blog),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới bài viết thành công',
    };
  }

  async update(data: UpdateBlogDto, user: UserDto) {
    const blog = await this.repo.findOne({ where: { id: data.id } });
    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const oldBlogData = JSON.stringify(blog);

    const blogUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (data.title) blogUpdateData.title = data.title;
    if (data.slug) blogUpdateData.slug = data.slug;
    if (data.excerpt !== undefined) blogUpdateData.excerpt = data.excerpt;
    if (data.content) blogUpdateData.content = data.content;
    if (data.featuredImage !== undefined)
      blogUpdateData.featuredImage = data.featuredImage;
    if (data.category) blogUpdateData.category = data.category;
    if (data.tags !== undefined) blogUpdateData.tags = data.tags;
    if (data.status) blogUpdateData.status = data.status;
    if (data.seoTitle !== undefined) blogUpdateData.seoTitle = data.seoTitle;
    if (data.seoDescription !== undefined)
      blogUpdateData.seoDescription = data.seoDescription;
    if (data.publishedAt !== undefined)
      blogUpdateData.publishedAt = data.publishedAt;

    if (Object.prototype.hasOwnProperty.call(data, 'featuredImage')) {
      await this.fileArchivalRepo.delete({ blogPostId: data.id });

      const imageData = Array.isArray(data.featuredImage)
        ? data.featuredImage[0]
        : data.featuredImage;
      if (imageData?.fileUrl && imageData?.fileName) {
        const fileArchival = new FileArchivalCreateDto();
        fileArchival.createdBy = user.id;
        fileArchival.fileUrl = imageData.fileUrl;
        fileArchival.fileName = imageData.fileName;
        fileArchival.fileRelationName = 'blogPostId';
        fileArchival.fileRelationId = data.id;
        await this.fileArchivalService.create(fileArchival);
      }
    }

    await this.repo.update(blog.id, blogUpdateData);

    const updatedBlog = await this.repo.findOne({
      where: { id: blog.id },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: blog.id,
      functionType: 'Blog',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật bài viết: ${blog.title}`,
      oldData: oldBlogData,
      newData: JSON.stringify(updatedBlog),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật bài viết thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const blog = await this.repo.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    await this.repo.update(id, {
      isDeleted: true,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: blog.id,
      functionType: 'Blog',
      type: enumData.ActionLogType.DEACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động bài viết: ${blog.title}`,
      oldData: JSON.stringify(blog),
      newData: JSON.stringify({
        ...blog,
        isDeleted: true,
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Ngừng hoạt động bài viết thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const blog = await this.repo.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    await this.repo.update(id, {
      isDeleted: false,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: blog.id,
      functionType: 'Blog',
      type: enumData.ActionLogType.ACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt bài viết: ${blog.title}`,
      oldData: JSON.stringify(blog),
      newData: JSON.stringify({
        ...blog,
        isDeleted: false,
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Kích hoạt bài viết thành công',
    };
  }

  async findByIds(ids: string[]): Promise<BlogPostEntity[]> {
    return await this.repo.find({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });
  }

  async findBlogCommentById(id: string) {
    const result = await this.commentRepo.findOne({
      where: { id },
      relations: {
        customer: true,
        post: true,
        parent: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    const data = transformKeys(result);

    return {
      message: 'Tìm kiếm bình luận thành công',
      data,
    };
  }

  async paginationBlogComment(data: PaginationDto) {
    const whereCon: FindOptionsWhere<BlogCommentEntity> = {};

    if (data.where.postId) whereCon.postId = data.where.postId;
    if (data.where.customerId) whereCon.customerId = data.where.customerId;
    if (data.where.status) whereCon.status = ILike(`%${data.where.status}%`);
    if (data.where.parentId) {
      whereCon.parentId = data.where.parentId;
    } else if (data.where.parentId === null) {
      whereCon.parentId = IsNull();
    }
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [comments, total] = await this.commentRepo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: {
        customer: true,
        post: true,
        parent: true,
      },
    });

    return {
      data: comments,
      total,
    };
  }

  async getBlogCommentsByPostId(postId: string, data: PaginationDto) {
    const post = await this.repo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const whereCon: FindOptionsWhere<BlogCommentEntity> = {
      postId,
      parentId: IsNull(),
      status: 'approved',
      isDeleted: false,
    };

    const [comments, total] = await this.commentRepo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: {
        customer: true,
      },
    });

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this.commentRepo.find({
          where: {
            parentId: comment.id,
            status: 'approved',
            isDeleted: false,
          },
          order: { createdAt: 'ASC' },
          relations: {
            customer: true,
          },
        });
        return {
          ...comment,
          replies,
        };
      }),
    );

    return {
      data: commentsWithReplies,
      total,
    };
  }

  async createBlogComment(createDto: CreateCommentDto, user: UserDto) {
    // Kiểm tra bài viết có tồn tại không
    const post = await this.repo.findOne({
      where: { id: createDto.postId },
    });
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Kiểm tra parent comment nếu có
    if (createDto.parentId) {
      const parentComment = await this.commentRepo.findOne({
        where: { id: createDto.parentId },
      });
      if (!parentComment) {
        throw new NotFoundException('Không tìm thấy bình luận cha');
      }
      if (parentComment.postId !== createDto.postId) {
        throw new BadRequestException('Bình luận cha không thuộc bài viết này');
      }
    }

    const comment = new BlogCommentEntity();
    comment.id = uuidv4();
    comment.postId = createDto.postId;
    comment.customerId = user.id;
    comment.content = createDto.content;
    comment.parentId = createDto.parentId;
    comment.status = 'pending';
    comment.createdBy = user.id;
    comment.createdAt = new Date();

    await this.commentRepo.insert(comment);

    const actionLogDto: ActionLogCreateDto = {
      functionId: comment.id,
      functionType: 'BlogComment',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới bình luận bài viết: ${post.title}`,
      oldData: '{}',
      newData: JSON.stringify(comment),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo bình luận thành công. Bình luận đang chờ duyệt',
      data: transformKeys(comment),
    };
  }

  async updateBlogComment(
    id: string,
    updateDto: UpdateCommentDto,
    user: UserDto,
  ) {
    const comment = await this.commentRepo.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    const oldCommentData = JSON.stringify(comment);

    if (comment.customerId !== user.id) {
      throw new ForbiddenException('Bạn không có quyền sửa bình luận này');
    }

    comment.content = updateDto.content;
    comment.updatedBy = user.id;
    comment.updatedAt = new Date();

    await this.commentRepo.save(comment);

    const actionLogDto: ActionLogCreateDto = {
      functionId: comment.id,
      functionType: 'BlogComment',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật bình luận bài viết: ${comment.content}`,
      oldData: oldCommentData,
      newData: JSON.stringify(comment),
    };

    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Cập nhật bình luận thành công',
      data: transformKeys(comment),
    };
  }

  async deleteBlogComment(id: string, user: UserDto) {
    const comment = await this.commentRepo.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    if (comment.customerId !== user.id && !user.userRoles?.includes('admin')) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    comment.isDeleted = true;
    comment.updatedBy = user.id;
    comment.updatedAt = new Date();

    await this.commentRepo.save(comment);

    const replies = await this.commentRepo.find({
      where: { parentId: id },
    });
    for (const reply of replies) {
      reply.isDeleted = true;
      reply.updatedBy = user.id;
      reply.updatedAt = new Date();
      await this.commentRepo.save(reply);
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: comment.id,
      functionType: 'BlogComment',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Xóa bình luận bài viết: ${comment.content}`,
      oldData: '{}',
      newData: JSON.stringify(comment),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Xóa bình luận thành công',
    };
  }

  async restoreBlogComment(id: string, user: UserDto) {
    const comment = await this.commentRepo.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    comment.isDeleted = false;
    comment.updatedBy = user.id;
    comment.updatedAt = new Date();

    await this.commentRepo.save(comment);

    const actionLogDto: ActionLogCreateDto = {
      functionId: comment.id,
      functionType: 'BlogComment',
      type: enumData.ActionLogType.RESTORE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Khôi phục bình luận bài viết: ${comment.content}`,
      oldData: '{}',
      newData: JSON.stringify(comment),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Khôi phục bình luận thành công',
      data: transformKeys(comment),
    };
  }
}
