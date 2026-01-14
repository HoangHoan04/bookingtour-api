import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto, UserDto } from 'src/dto';
import { NotificationEntity, NotificationSettingEntity } from 'src/entities';
import {
  NotificationRepository,
  NotificationSettingRepository,
  UserRepository,
} from 'src/repositories';
import { In } from 'typeorm';
import {
  NotificationCreateAdminDto,
  NotificationCreateDto,
  UpdateNotificationSettingDto,
} from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepo: NotificationRepository,
    private notificationSettingRepo: NotificationSettingRepository,
    private userRepo: UserRepository,
  ) {}

  async createNotify(senderId: string, data: NotificationCreateDto) {
    const whereCon: any = {};
    if (data.lstUserId && data.lstUserId.length > 0) {
      whereCon.id = In(data.lstUserId);
    }

    const lstUser = await this.userRepo.find({
      where: whereCon,
      select: { id: true, customerId: true },
    });

    if (lstUser.length === 0) {
      throw new NotFoundException('Không tìm thấy người nhận');
    }

    const notifications: NotificationEntity[] = [];
    for (const user of lstUser) {
      if (!user.customerId) continue;

      const notification = new NotificationEntity();
      notification.customerId = user.customerId;
      notification.title = data.title;
      notification.content = data.content;
      notification.notificationType = data.notificationType || 'general';
      if (data.relatedEntity) notification.relatedEntity = data.relatedEntity;
      if (data.relatedId) notification.relatedId = data.relatedId;
      notification.priority = data.priority || 'normal';
      if (data.actionUrl) notification.actionUrl = data.actionUrl;
      if (data.expiresAt) notification.expiresAt = data.expiresAt;
      notification.isRead = false;
      notification.createdBy = senderId;

      notifications.push(notification);
    }

    const savedNotifications = await this.notificationRepo.save(notifications);

    return {
      message: 'Tạo thông báo thành công',
      data: savedNotifications,
    };
  }

  async createNotifyAdmin(
    senderId: string,
    data: NotificationCreateAdminDto,
  ): Promise<any> {
    const lstUserAdmin = await this.userRepo.find({
      where: { isAdmin: true, isDeleted: false, isActive: true },
      select: { id: true, customerId: true },
    });

    if (lstUserAdmin.length === 0) {
      return;
    }

    const notifications: NotificationEntity[] = [];
    for (const user of lstUserAdmin) {
      if (!user.customerId) continue;

      const notification = new NotificationEntity();
      notification.customerId = user.customerId;
      notification.title = data.title;
      notification.content = data.content;
      notification.notificationType = data.notificationType || 'system';
      if (data.relatedEntity) notification.relatedEntity = data.relatedEntity;
      if (data.relatedId) notification.relatedId = data.relatedId;
      notification.priority = data.priority || 'high';
      if (data.actionUrl) notification.actionUrl = data.actionUrl;
      if (data.expiresAt) notification.expiresAt = data.expiresAt;
      notification.isRead = false;
      notification.createdBy = senderId;

      notifications.push(notification);
    }

    const savedNotifications = await this.notificationRepo.save(notifications);

    return {
      message: 'Gửi thông báo tới admin thành công',
      data: savedNotifications,
    };
  }

  async updateSeenAll(user: UserDto) {
    if (!user.customerId) {
      throw new NotFoundException('Không tìm thấy thông tin khách hàng');
    }

    await this.notificationRepo.update(
      { customerId: user.customerId, isRead: false },
      { isRead: true, readAt: new Date(), updatedBy: user.id },
    );

    return { message: 'Đánh dấu tất cả đã đọc thành công', status_code: 200 };
  }

  async updateSeenListNotify(user: UserDto, data: { lstId: string[] }) {
    if (!user.customerId) {
      throw new NotFoundException('Không tìm thấy thông tin khách hàng');
    }

    await this.notificationRepo.update(
      { customerId: user.customerId, id: In(data.lstId), isRead: false },
      { isRead: true, readAt: new Date(), updatedBy: user.id },
    );

    return { message: 'Đánh dấu đã đọc thành công', status_code: 200 };
  }

  async findCountNotiNotSeen(user: UserDto) {
    if (!user || !user.customerId) return { countAll: 0 };

    const count = await this.notificationRepo.count({
      where: {
        customerId: user.customerId,
        isRead: false,
        isDeleted: false,
      },
    });

    return { countAll: count };
  }

  async pagination(
    user: UserDto,
    { where, skip, take }: PaginationDto,
  ): Promise<any> {
    if (!user.customerId) {
      throw new NotFoundException('Không tìm thấy thông tin khách hàng');
    }

    const queryBuilder = this.notificationRepo
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.customer', 'customer')
      .where('notification.customerId = :customerId', {
        customerId: user.customerId,
      })
      .andWhere('notification.isDeleted = :isDeleted', { isDeleted: false });

    if (where?.notificationType) {
      queryBuilder.andWhere('notification.notificationType = :type', {
        type: where.notificationType,
      });
    }

    if (where?.priority) {
      queryBuilder.andWhere('notification.priority = :priority', {
        priority: where.priority,
      });
    }

    if (where?.isRead !== undefined) {
      queryBuilder.andWhere('notification.isRead = :isRead', {
        isRead: where.isRead,
      });
    }

    const [data, total] = await queryBuilder
      .orderBy('notification.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      data,
      total,
    };
  }

  async deleteNotification(userId: string, notificationId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: { customerId: true },
    });

    if (!user?.customerId) {
      throw new NotFoundException('Không tìm thấy thông tin khách hàng');
    }

    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId, customerId: user.customerId },
    });

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    await this.notificationRepo.softDelete(notificationId);

    return {
      message: 'Xóa thông báo thành công',
      status_code: 200,
    };
  }

  async getNotificationDetail(userId: string, notificationId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: { customerId: true },
    });

    if (!user?.customerId) {
      throw new NotFoundException('Không tìm thấy thông tin khách hàng');
    }

    const notification = await this.notificationRepo.findOne({
      where: {
        id: notificationId,
        customerId: user.customerId,
        isDeleted: false,
      },
      relations: ['customer'],
    });

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date();
      notification.updatedBy = userId;
      await this.notificationRepo.save(notification);
    }

    return {
      data: notification,
    };
  }

  async getSettings(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: { customerId: true },
    });

    if (!user?.customerId) {
      throw new NotFoundException('Không tìm thấy thông tin khách hàng');
    }

    let setting = await this.notificationSettingRepo.findOne({
      where: { customerId: user.customerId },
    });

    // Nếu chưa có setting thì tạo mới với giá trị mặc định
    if (!setting) {
      setting = new NotificationSettingEntity();
      setting.customerId = user.customerId;
      setting.emailNotifications = true;
      setting.pushNotifications = true;
      setting.smsNotifications = false;
      setting.promotionNotifications = true;
      setting.bookingNotifications = true;
      setting.recommendationNotifications = true;
      setting.createdBy = userId;
      setting = await this.notificationSettingRepo.save(setting);
    }

    return {
      data: setting,
    };
  }

  async updateSettings(
    userId: string,
    data: UpdateNotificationSettingDto,
  ): Promise<any> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: { customerId: true },
    });

    if (!user?.customerId) {
      throw new NotFoundException('Không tìm thấy thông tin khách hàng');
    }

    let setting = await this.notificationSettingRepo.findOne({
      where: { customerId: user.customerId },
    });

    // Nếu chưa có setting thì tạo mới
    if (!setting) {
      setting = new NotificationSettingEntity();
      setting.customerId = user.customerId;
      setting.createdBy = userId;
    }

    // Update các trường nếu có trong data
    if (data.emailNotifications !== undefined) {
      setting.emailNotifications = data.emailNotifications;
    }
    if (data.pushNotifications !== undefined) {
      setting.pushNotifications = data.pushNotifications;
    }
    if (data.smsNotifications !== undefined) {
      setting.smsNotifications = data.smsNotifications;
    }
    if (data.promotionNotifications !== undefined) {
      setting.promotionNotifications = data.promotionNotifications;
    }
    if (data.bookingNotifications !== undefined) {
      setting.bookingNotifications = data.bookingNotifications;
    }
    if (data.recommendationNotifications !== undefined) {
      setting.recommendationNotifications = data.recommendationNotifications;
    }

    setting.updatedBy = userId;
    await this.notificationSettingRepo.save(setting);

    return {
      message: 'Cập nhật cài đặt thông báo thành công',
      data: setting,
    };
  }
}
