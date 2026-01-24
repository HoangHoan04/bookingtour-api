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
import { FileArchivalCreateDto } from '../file-archival/dto';
import { FileArchivalService } from '../file-archival/file-archival.service';
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
    blog.status = enumData.BLOG_STATUS.NEW.code;
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

  async approveBlogPost(id: string, user: UserDto) {
    const blog = await this.repo.findOne({ where: { id } });

    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const oldData = JSON.stringify(blog);

    blog.status = enumData.BLOG_STATUS.PUBLISHED.code;
    blog.updatedBy = user.id;
    blog.updatedAt = new Date();

    await this.repo.save(blog);
    const actionLogDto: ActionLogCreateDto = {
      functionId: blog.id,
      functionType: 'Blog',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Duyệt bài viết: ${blog.content}`,
      oldData: oldData,
      newData: JSON.stringify(blog),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Duyệt bài viết thành công',
      data: transformKeys(blog),
    };
  }

  // Thêm các hàm này vào BlogService

  /**
   * Chuyển bài viết sang trạng thái Draft
   */
  async draftBlogPost(id: string, user: UserDto) {
    const blog = await this.repo.findOne({ where: { id } });

    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const oldData = JSON.stringify(blog);

    blog.status = enumData.BLOG_STATUS.DRAFT.code;
    blog.updatedBy = user.id;
    blog.updatedAt = new Date();

    await this.repo.save(blog);

    const actionLogDto: ActionLogCreateDto = {
      functionId: blog.id,
      functionType: 'Blog',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Chuyển bài viết sang bản nháp: ${blog.title}`,
      oldData: oldData,
      newData: JSON.stringify(blog),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Chuyển bài viết sang bản nháp thành công',
      data: transformKeys(blog),
    };
  }

  /**
   * Xuất bản bài viết (giống approveBlogPost nhưng đổi tên cho rõ nghĩa hơn)
   */
  async publishBlogPost(id: string, user: UserDto) {
    const blog = await this.repo.findOne({ where: { id } });

    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const oldData = JSON.stringify(blog);

    blog.status = enumData.BLOG_STATUS.PUBLISHED.code;
    blog.updatedBy = user.id;
    blog.updatedAt = new Date();

    // Nếu chưa có publishedAt thì set thời gian xuất bản
    if (!blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    await this.repo.save(blog);

    const actionLogDto: ActionLogCreateDto = {
      functionId: blog.id,
      functionType: 'Blog',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Xuất bản bài viết: ${blog.title}`,
      oldData: oldData,
      newData: JSON.stringify(blog),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Xuất bản bài viết thành công',
      data: transformKeys(blog),
    };
  }

  /**
   * Từ chối xuất bản bài viết
   */
  async rejectBlogPost(id: string, user: UserDto, reason?: string) {
    const blog = await this.repo.findOne({ where: { id } });

    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const oldData = JSON.stringify(blog);

    blog.status = enumData.BLOG_STATUS.REJECT.code;
    blog.updatedBy = user.id;
    blog.updatedAt = new Date();

    await this.repo.save(blog);

    const description = reason
      ? `Từ chối xuất bản bài viết: ${blog.title}. Lý do: ${reason}`
      : `Từ chối xuất bản bài viết: ${blog.title}`;

    const actionLogDto: ActionLogCreateDto = {
      functionId: blog.id,
      functionType: 'Blog',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: description,
      oldData: oldData,
      newData: JSON.stringify(blog),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Từ chối xuất bản bài viết thành công',
      data: transformKeys(blog),
    };
  }

  /**
   * Lưu trữ bài viết
   */
  async archiveBlogPost(id: string, user: UserDto) {
    const blog = await this.repo.findOne({ where: { id } });

    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const oldData = JSON.stringify(blog);

    blog.status = enumData.BLOG_STATUS.ARCHIVED.code;
    blog.updatedBy = user.id;
    blog.updatedAt = new Date();

    await this.repo.save(blog);

    const actionLogDto: ActionLogCreateDto = {
      functionId: blog.id,
      functionType: 'Blog',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Lưu trữ bài viết: ${blog.title}`,
      oldData: oldData,
      newData: JSON.stringify(blog),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Lưu trữ bài viết thành công',
      data: transformKeys(blog),
    };
  }

  /**
   * Khôi phục bài viết từ archived về draft
   */
  async unarchiveBlogPost(id: string, user: UserDto) {
    const blog = await this.repo.findOne({ where: { id } });

    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    if (blog.status !== enumData.BLOG_STATUS.ARCHIVED.code) {
      throw new BadRequestException(
        'Chỉ có thể khôi phục bài viết đang ở trạng thái lưu trữ',
      );
    }

    const oldData = JSON.stringify(blog);

    blog.status = enumData.BLOG_STATUS.DRAFT.code;
    blog.updatedBy = user.id;
    blog.updatedAt = new Date();

    await this.repo.save(blog);

    const actionLogDto: ActionLogCreateDto = {
      functionId: blog.id,
      functionType: 'Blog',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Khôi phục bài viết từ lưu trữ: ${blog.title}`,
      oldData: oldData,
      newData: JSON.stringify(blog),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Khôi phục bài viết thành công',
      data: transformKeys(blog),
    };
  }

  /**
   * Thay đổi trạng thái bài viết (hàm tổng quát)
   */
  async changeBlogStatus(
    id: string,
    status: string,
    user: UserDto,
    reason?: string,
  ) {
    const blog = await this.repo.findOne({ where: { id } });

    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Validate status
    const validStatuses = Object.values(enumData.BLOG_STATUS).map(
      (s) => s.code,
    );
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Trạng thái không hợp lệ');
    }

    const oldData = JSON.stringify(blog);
    const oldStatus = blog.status;

    blog.status = status;
    blog.updatedBy = user.id;
    blog.updatedAt = new Date();

    // Set publishedAt khi chuyển sang PUBLISHED
    if (status === enumData.BLOG_STATUS.PUBLISHED.code && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    await this.repo.save(blog);

    const statusName =
      Object.values(enumData.BLOG_STATUS).find((s) => s.code === status)
        ?.name || status;
    const description = reason
      ? `Thay đổi trạng thái bài viết "${blog.title}" từ ${oldStatus} sang ${statusName}. Lý do: ${reason}`
      : `Thay đổi trạng thái bài viết "${blog.title}" từ ${oldStatus} sang ${statusName}`;

    const actionLogDto: ActionLogCreateDto = {
      functionId: blog.id,
      functionType: 'Blog',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: description,
      oldData: oldData,
      newData: JSON.stringify(blog),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: `Thay đổi trạng thái bài viết thành công`,
      data: transformKeys(blog),
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
      status: enumData.BLOG_COMMENT_STATUS.APPROVED.code,
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
            status: enumData.BLOG_COMMENT_STATUS.APPROVED.code,
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
    comment.status = enumData.BLOG_COMMENT_STATUS.PENDING.code;
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

  /**
   * Lấy danh sách bài viết đã xuất bản cho user
   */
  async getPublishedBlogs(data: PaginationDto) {
    const whereCon: FindOptionsWhere<BlogPostEntity> = {
      status: enumData.BLOG_STATUS.PUBLISHED.code,
      isDeleted: false,
    };

    if (data.where.title) whereCon.title = ILike(`%${data.where.title}%`);
    if (data.where.category)
      whereCon.category = ILike(`%${data.where.category}%`);

    const [blogs, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { publishedAt: 'DESC' },
      relations: {
        author: true,
        featuredImage: true,
      },
    });

    return {
      data: blogs.map((blog) => transformKeys(blog)),
      total,
    };
  }

  /**
   * Lấy chi tiết bài viết bằng slug cho user
   */
  async getPublishedBlogBySlug(slug: string) {
    const blog = await this.repo.findOne({
      where: {
        slug,
        status: enumData.BLOG_STATUS.PUBLISHED.code,
        isDeleted: false,
      },
      relations: {
        author: true,
        featuredImage: true,
      },
    });

    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Tăng view count
    await this.repo.update(blog.id, {
      viewCount: blog.viewCount + 1,
    });

    const data = transformKeys(blog);

    return {
      message: 'Lấy thông tin bài viết thành công',
      data: {
        ...data,
        viewCount: blog.viewCount + 1,
      },
    };
  }

  /**
   * Lấy bài viết liên quan
   */
  async getRelatedBlogs(blogId: string, limit: number = 5) {
    const currentBlog = await this.repo.findOne({
      where: { id: blogId },
    });

    if (!currentBlog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Lấy bài viết cùng category
    const relatedByCategory = await this.repo.find({
      where: {
        category: currentBlog.category,
        status: enumData.BLOG_STATUS.PUBLISHED.code,
        isDeleted: false,
      },
      relations: {
        author: true,
        featuredImage: true,
      },
      order: { publishedAt: 'DESC' },
      take: limit,
    });

    // Lọc bỏ bài viết hiện tại
    const filtered = relatedByCategory.filter((blog) => blog.id !== blogId);

    return {
      data: filtered.slice(0, limit).map((blog) => transformKeys(blog)),
    };
  }

  /**
   * Lấy danh sách bài viết phổ biến
   */
  async getPopularBlogs(limit: number = 10) {
    const blogs = await this.repo.find({
      where: {
        status: enumData.BLOG_STATUS.PUBLISHED.code,
        isDeleted: false,
      },
      relations: {
        author: true,
        featuredImage: true,
      },
      order: {
        viewCount: 'DESC',
        likeCount: 'DESC',
      },
      take: limit,
    });

    return {
      data: blogs.map((blog) => transformKeys(blog)),
    };
  }

  /**
   * Lấy danh sách bài viết mới nhất
   */
  async getLatestBlogs(limit: number = 10) {
    const blogs = await this.repo.find({
      where: {
        status: enumData.BLOG_STATUS.PUBLISHED.code,
        isDeleted: false,
      },
      relations: {
        author: true,
        featuredImage: true,
      },
      order: {
        publishedAt: 'DESC',
      },
      take: limit,
    });

    return {
      data: blogs.map((blog) => transformKeys(blog)),
    };
  }

  /**
   * Lấy danh sách categories
   */
  async getCategories() {
    const allBlogs = await this.repo.find({
      where: {
        status: enumData.BLOG_STATUS.PUBLISHED.code,
        isDeleted: false,
      },
      select: {
        category: true,
      },
    });

    // Đếm số lượng bài viết theo category
    const categoryMap = new Map<string, number>();

    allBlogs.forEach((blog) => {
      if (blog.category) {
        categoryMap.set(
          blog.category,
          (categoryMap.get(blog.category) || 0) + 1,
        );
      }
    });

    const categories = Array.from(categoryMap.entries()).map(
      ([category, count]) => ({
        category,
        count,
      }),
    );

    return {
      data: categories.sort((a, b) => b.count - a.count),
    };
  }

  /**
   * Lấy danh sách tags
   */
  async getTags() {
    const blogs = await this.repo.find({
      where: {
        status: enumData.BLOG_STATUS.PUBLISHED.code,
        isDeleted: false,
      },
      select: {
        tags: true,
      },
    });

    const tagsMap = new Map<string, number>();

    blogs.forEach((blog) => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach((tag) => {
          tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
        });
      }
    });

    const tags = Array.from(tagsMap.entries()).map(([tag, count]) => ({
      tag,
      count,
    }));

    return {
      data: tags.sort((a, b) => b.count - a.count),
    };
  }

  /**
   * Like bài viết
   */
  async likeBlog(blogId: string, user: UserDto) {
    const blog = await this.repo.findOne({
      where: {
        id: blogId,
        status: enumData.BLOG_STATUS.PUBLISHED.code,
        isDeleted: false,
      },
    });

    if (!blog) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    await this.repo.update(blogId, {
      likeCount: blog.likeCount + 1,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: blog.id,
      functionType: 'Blog',
      type: 'LIKE',
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Thích bài viết: ${blog.title}`,
      oldData: JSON.stringify({ likeCount: blog.likeCount }),
      newData: JSON.stringify({ likeCount: blog.likeCount + 1 }),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Đã thích bài viết',
      data: {
        likeCount: blog.likeCount + 1,
      },
    };
  }

  /**
   * Tìm kiếm bài viết
   */
  async searchBlogs(keyword: string, data: PaginationDto) {
    const whereCon: FindOptionsWhere<BlogPostEntity>[] = [
      {
        title: ILike(`%${keyword}%`),
        status: enumData.BLOG_STATUS.PUBLISHED.code,
        isDeleted: false,
      },
      {
        excerpt: ILike(`%${keyword}%`),
        status: enumData.BLOG_STATUS.PUBLISHED.code,
        isDeleted: false,
      },
      {
        content: ILike(`%${keyword}%`),
        status: enumData.BLOG_STATUS.PUBLISHED.code,
        isDeleted: false,
      },
    ];

    const [blogs, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { publishedAt: 'DESC' },
      relations: {
        author: true,
        featuredImage: true,
      },
    });

    return {
      data: blogs.map((blog) => transformKeys(blog)),
      total,
    };
  }

  /**
   * Lấy bài viết theo category
   */
  async getBlogsByCategory(category: string, data: PaginationDto) {
    const [blogs, total] = await this.repo.findAndCount({
      where: {
        category,
        status: enumData.BLOG_STATUS.PUBLISHED.code,
        isDeleted: false,
      },
      skip: data.skip,
      take: data.take,
      order: { publishedAt: 'DESC' },
      relations: {
        author: true,
        featuredImage: true,
      },
    });

    return {
      data: blogs.map((blog) => transformKeys(blog)),
      total,
    };
  }

  /**
   * Lấy bài viết theo tag
   */
  async getBlogsByTag(tag: string, data: PaginationDto) {
    // Lấy tất cả bài viết published
    const allBlogs = await this.repo.find({
      where: {
        status: enumData.BLOG_STATUS.PUBLISHED.code,
        isDeleted: false,
      },
      relations: {
        author: true,
        featuredImage: true,
      },
      order: { publishedAt: 'DESC' },
    });

    // Lọc blogs có tag tương ứng
    const filteredBlogs = allBlogs.filter(
      (blog) => blog.tags && blog.tags.includes(tag),
    );

    const total = filteredBlogs.length;
    const paginatedBlogs = filteredBlogs.slice(
      data.skip,
      data.skip + data.take,
    );

    return {
      data: paginatedBlogs.map((blog) => transformKeys(blog)),
      total,
    };
  }

  /**
   * Approve comment (Admin only)
   */
  async approveBlogComment(id: string, user: UserDto) {
    const comment = await this.commentRepo.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    const oldData = JSON.stringify(comment);

    comment.status = enumData.BLOG_COMMENT_STATUS.APPROVED.code;
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
      description: `Duyệt bình luận: ${comment.content}`,
      oldData: oldData,
      newData: JSON.stringify(comment),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Duyệt bình luận thành công',
      data: transformKeys(comment),
    };
  }

  /**
   * Reject comment (Admin only)
   */
  async rejectBlogComment(id: string, user: UserDto) {
    const comment = await this.commentRepo.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    const oldData = JSON.stringify(comment);

    comment.status = enumData.BLOG_COMMENT_STATUS.REJECTED.code;
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
      description: `Từ chối bình luận: ${comment.content}`,
      oldData: oldData,
      newData: JSON.stringify(comment),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Từ chối bình luận thành công',
      data: transformKeys(comment),
    };
  }
}
