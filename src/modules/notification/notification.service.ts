import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto, UserDto } from 'src/dto';
import { NotificationEntity, NotificationRecipientEntity } from 'src/entities';
import {
  NotificationRecipientRepository,
  NotificationRepository,
  UserRepository,
} from 'src/repositories';
import { In } from 'typeorm';
import {
  NotificationCreateAdminDto,
  NotificationCreateDto,
} from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepo: NotificationRepository,
    private recipientRepo: NotificationRecipientRepository,
    private userRepo: UserRepository,
  ) {}

  async createNotify(senderId: string, data: NotificationCreateDto) {
    const whereCon: any = {};
    if (data.lstUserId && data.lstUserId.length > 0) {
      whereCon.id = In(data.lstUserId);
    }
    if (data.lstEmployeeId && data.lstEmployeeId.length > 0) {
      whereCon.employeeId = In(data.lstEmployeeId);
    }

    const lstUser = await this.userRepo.find({
      where: whereCon,
      select: { id: true, employeeId: true },
    });

    if (lstUser.length === 0) {
      throw new NotFoundException('Không tìm thấy người nhận');
    }

    const notification = new NotificationEntity();
    notification.title = data.title;
    notification.content = data.content;
    notification.type = data.type || 'thông báo';
    notification.priority = data.priority || 'normal';
    notification.senderId = senderId;
    notification.targetAudience = data.targetAudience || 'specific';
    notification.classId = data.classId;
    notification.status = 'published';
    notification.publishDate = new Date();
    notification.expiryDate = data.expiryDate;
    notification.attachments = data.attachments;
    notification.createdBy = senderId;

    const savedNotification = await this.notificationRepo.save(notification);

    const recipients = lstUser.map((user) => {
      const recipient = new NotificationRecipientEntity();
      recipient.notificationId = savedNotification.id;
      recipient.userId = user.id;
      recipient.isRead = false;
      recipient.createdBy = senderId;
      return recipient;
    });

    await this.recipientRepo.insert(recipients);

    return {
      message: 'Tạo thông báo thành công',
      data: savedNotification,
    };
  }

  async createNotifyAdmin(
    senderId: string,
    data: NotificationCreateAdminDto,
  ): Promise<any> {
    const lstUserAdmin = await this.userRepo.find({
      where: { isAdmin: true, isDeleted: false, isActive: true },
      select: { id: true },
    });

    if (lstUserAdmin.length === 0) {
      return;
    }

    const notification = new NotificationEntity();
    Object.assign(notification, {
      title: data.title,
      content: data.content,
      type: data.type || 'thông báo hệ thống',
      priority: data.priority || 'normal',
      senderId: senderId,
      targetAudience: data.targetAudience || 'admins',
      classId: data.classId,
      status: 'published',
      publishDate: new Date(),
      expiryDate: data.expiryDate,
      attachments: data.attachments,
      createdBy: senderId,
      createdAt: new Date(),
    });

    const savedNotification = await this.notificationRepo.save(notification);

    const recipients = lstUserAdmin.map((user) => {
      const recipient = new NotificationRecipientEntity();
      recipient.notificationId = savedNotification.id;
      recipient.userId = user.id;
      recipient.isRead = false;
      recipient.createdBy = senderId;
      recipient.createdAt = new Date();
      return recipient;
    });

    await this.recipientRepo.insert(recipients);

    return {
      message: 'Gửi thông báo tới admin thành công',
      data: savedNotification,
    };
  }

  async updateSeenAll(user: UserDto) {
    await this.recipientRepo.update(
      { userId: user.id, isRead: false },
      { isRead: true, readAt: new Date(), updatedBy: user.id },
    );
    return { message: 'Đánh dấu tất cả đã đọc thành công', status_code: 200 };
  }

  async updateSeenListNotify(user: UserDto, data: { lstId: string[] }) {
    await this.recipientRepo.update(
      { userId: user.id, notificationId: In(data.lstId), isRead: false },
      { isRead: true, readAt: new Date(), updatedBy: user.id },
    );
    return { message: 'Đánh dấu đã đọc thành công', status_code: 200 };
  }

  async findCountNotiNotSeen(user: UserDto) {
    if (!user) return { countAll: 0 };
    const count = await this.recipientRepo.count({
      where: {
        userId: user.id,
        isRead: false,
        notification: { status: 'published', isDeleted: false },
      },
      relations: { notification: true },
    });
    return { countAll: count };
  }

  async pagination(
    user: UserDto,
    { where, skip, take }: PaginationDto,
  ): Promise<any> {
    const queryBuilder = this.recipientRepo
      .createQueryBuilder('recipient')
      .leftJoinAndSelect('recipient.notification', 'notification')
      .leftJoin('notification.sender', 'sender')
      .addSelect(['sender.id', 'sender.username', 'sender.email'])
      .where('recipient.userId = :userId', { userId: user.id })
      .andWhere('notification.status = :status', { status: 'published' })
      .andWhere('notification.isDeleted = :isDeleted', { isDeleted: false });

    if (where?.type) {
      queryBuilder.andWhere('notification.type = :type', { type: where.type });
    }

    if (where?.priority) {
      queryBuilder.andWhere('notification.priority = :priority', {
        priority: where.priority,
      });
    }

    const [recipients, total] = await queryBuilder
      .orderBy('notification.publishDate', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const data = recipients.map((item) => ({
      ...item.notification,
      isRead: item.isRead,
      readAt: item.readAt,
      recipients: undefined,
    }));

    return {
      data,
      total,
    };
  }

  async deleteNotification(userId: string, notificationId: string) {
    const recipient = await this.recipientRepo.findOne({
      where: { userId, notificationId },
    });

    if (!recipient) throw new NotFoundException('Không tìm thấy thông báo');

    await this.recipientRepo.delete({ userId, notificationId });

    return {
      message: 'Xóa thông báo thành công',
      status_code: 200,
    };
  }

  async getNotificationDetail(userId: string, notificationId: string) {
    const recipient = await this.recipientRepo.findOne({
      where: { userId, notificationId },
      relations: ['notification', 'notification.sender'],
    });

    if (!recipient || recipient.notification.isDeleted) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    if (!recipient.isRead) {
      await this.recipientRepo.update(recipient.id, {
        isRead: true,
        readAt: new Date(),
        updatedBy: userId,
      });
      recipient.isRead = true;
      recipient.readAt = new Date();
    }

    return {
      data: {
        ...recipient.notification,
        isRead: recipient.isRead,
        readAt: recipient.readAt,
        sender: {
          id: recipient.notification.sender?.id,
          username: recipient.notification.sender?.username,
        },
      },
    };
  }
}
