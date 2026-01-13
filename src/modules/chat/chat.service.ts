import { Injectable } from '@nestjs/common';
import { CallParticipantEntity } from 'src/entities/message/call-participant.entity';
import {
  CallLogRepository,
  CallParticipantRepository,
  ChatMessageRepository,
  ChatRoomMemberRepository,
  ChatRoomRepository,
  EmployeeRepository,
} from 'src/repositories';

@Injectable()
export class ChatService {
  constructor(
    private chatRoomRepo: ChatRoomRepository,
    private chatRoomMemberRepo: ChatRoomMemberRepository,
    private chatMessageRepo: ChatMessageRepository,
    private callLogRepo: CallLogRepository,
    private callParticipantRepo: CallParticipantRepository,
    private employeeRepo: EmployeeRepository,
  ) {}

  async getUserChatRooms(userId: string) {
    const members = await this.chatRoomMemberRepo.find({
      where: { userId, hasLeft: false },
      relations: [
        'chatRoom',
        'chatRoom.members',
        'chatRoom.members.user',
        'chatRoom.members.user.employee',
      ],
    });

    const rooms = await Promise.all(
      members.map(async (m) => {
        const lastMessage = await this.chatMessageRepo.findOne({
          where: { chatRoomId: m.chatRoom.id, isDeleted: false },
          order: { createdAt: 'DESC' },
        });

        const unreadCount = m.lastReadAt
          ? await this.chatMessageRepo
              .createQueryBuilder('msg')
              .where('msg.chatRoomId = :chatRoomId', {
                chatRoomId: m.chatRoom.id,
              })
              .andWhere('msg.isDeleted = :isDeleted', { isDeleted: false })
              .andWhere('msg.senderId != :userId', { userId })
              .andWhere('msg.createdAt > :lastReadAt', {
                lastReadAt: m.lastReadAt,
              })
              .getCount()
          : await this.chatMessageRepo
              .createQueryBuilder('msg')
              .where('msg.chatRoomId = :chatRoomId', {
                chatRoomId: m.chatRoom.id,
              })
              .andWhere('msg.isDeleted = :isDeleted', { isDeleted: false })
              .andWhere('msg.senderId != :userId', { userId })
              .getCount();

        return {
          ...m.chatRoom,
          lastMessage: lastMessage?.content || null,
          lastMessageTime: lastMessage?.createdAt || null,
          unreadCount: unreadCount || 0,
        };
      }),
    );

    return rooms;
  }

  async createDirectChatRoom(userId1: string, userId2: string) {
    const existingRoom = await this.findDirectChatRoom(userId1, userId2);
    if (existingRoom) {
      return existingRoom;
    }
    const room = this.chatRoomRepo.create({
      type: 'DIRECT',
      createdByUserId: userId1,
      createdBy: userId1,
      createdAt: new Date(),
    });
    await this.chatRoomRepo.save(room);
    await this.addMemberToRoom(room.id, userId1, 'ADMIN');
    await this.addMemberToRoom(room.id, userId2, 'MEMBER');

    return room;
  }

  async createGroupChatRoom(
    name: string,
    creatorId: string,
    memberIds: string[],
  ) {
    const room = this.chatRoomRepo.create({
      name,
      type: 'GROUP',
      createdByUserId: creatorId,
      createdBy: creatorId,
    });
    await this.chatRoomRepo.save(room);
    await this.addMemberToRoom(room.id, creatorId, 'ADMIN');
    for (const memberId of memberIds) {
      await this.addMemberToRoom(room.id, memberId, 'MEMBER');
    }

    return room;
  }

  async addMemberToRoom(
    roomId: string,
    userId: string,
    role: 'ADMIN' | 'MEMBER' = 'MEMBER',
  ) {
    const member = this.chatRoomMemberRepo.create({
      chatRoomId: roomId,
      userId,
      role,
      createdBy: userId,
      createdAt: new Date(),
    });

    return await this.chatRoomMemberRepo.save(member);
  }

  async findDirectChatRoom(userId1: string, userId2: string) {
    const rooms1 = await this.getUserChatRooms(userId1);
    const rooms2 = await this.getUserChatRooms(userId2);

    const directRooms = rooms1.filter(
      (r) => r.type === 'DIRECT' && rooms2.find((r2) => r2.id === r.id),
    );

    return directRooms[0] || null;
  }

  async getChatRoomWithMembers(roomId: string) {
    return await this.chatRoomRepo.findOne({
      where: { id: roomId },
      relations: ['members', 'members.user', 'members.user.employee'],
    });
  }

  async createMessage(data: {
    chatRoomId: string;
    senderId: string;
    content: string;
    messageType?: string;
    attachments?: any[];
    replyToMessageId?: string;
    createdBy: string;
  }) {
    try {
      const message = this.chatMessageRepo.create({
        ...data,
        createdBy: data.senderId,
      });

      const saved = await this.chatMessageRepo.save(message);
      const result = await this.chatMessageRepo.findOne({
        where: { id: saved.id },
        relations: ['sender', 'sender.employee'],
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getMessages(chatRoomId: string, limit = 50, offset = 0) {
    const messages = await this.chatMessageRepo.find({
      where: { chatRoomId, isDeleted: false },
      relations: ['sender', 'sender.employee', 'replyToMessage'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return messages;
  }

  async markMessageAsRead(chatRoomId: string, userId: string) {
    await this.chatRoomMemberRepo.update(
      { chatRoomId, userId },
      { lastReadAt: new Date() },
    );
  }

  async markRoomAsRead(roomId: string, userId: string) {
    await this.chatRoomMemberRepo.update(
      { chatRoomId: roomId, userId },
      { lastReadAt: new Date() },
    );
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.chatMessageRepo.findOne({
      where: { id: messageId },
    });
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId !== userId) {
      throw new Error('Unauthorized');
    }

    await this.chatMessageRepo.update(messageId, {
      isDeleted: true,
      updatedBy: userId,
    });
  }

  async editMessage(messageId: string, userId: string, newContent: string) {
    const message = await this.chatMessageRepo.findOne({
      where: { id: messageId },
    });
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId !== userId) {
      throw new Error('Unauthorized');
    }

    await this.chatMessageRepo.update(messageId, {
      content: newContent,
      isEdited: true,
      editedAt: new Date(),
      updatedBy: userId,
    });
  }

  async createCallLog(data: {
    chatRoomId: string;
    callerId: string;
    callType: 'AUDIO' | 'VIDEO';
    status: string;
    createdBy: string;
  }) {
    const callLog = this.callLogRepo.create({
      ...data,
      startedAt: new Date(),
      createdBy: data.callerId,
    });

    const saved = await this.callLogRepo.save(callLog);
    await this.callParticipantRepo.save(
      this.callParticipantRepo.create({
        callLogId: saved.id,
        userId: data.callerId,
        status: 'ANSWERED',
        joinedAt: new Date(),
        createdBy: data.callerId,
      }),
    );
    const room = await this.getChatRoomWithMembers(data.chatRoomId);
    if (!room) {
      throw new Error('Chat room not found');
    }
    for (const member of room.members) {
      if (member.userId !== data.callerId) {
        await this.callParticipantRepo.save(
          this.callParticipantRepo.create({
            callLogId: saved.id,
            userId: member.userId,
            status: 'MISSED',
            createdBy: data.callerId,
          }),
        );
      }
    }

    return saved;
  }

  async getCallLog(callLogId: string) {
    return await this.callLogRepo.findOne({
      where: { id: callLogId },
      relations: ['participants', 'caller'],
    });
  }

  async updateCallParticipant(
    callLogId: string,
    userId: string,
    data: Partial<CallParticipantEntity>,
  ) {
    await this.callParticipantRepo.update(
      { callLogId, userId },
      { ...data, updatedBy: userId },
    );
  }

  async endCall(callLogId: string) {
    const callLog = await this.getCallLog(callLogId);

    if (!callLog) {
      throw new Error('Call log not found');
    }
    const endedAt = new Date();
    const duration = Math.floor(
      (endedAt.getTime() - callLog.startedAt.getTime()) / 1000,
    );

    await this.callLogRepo.update(callLogId, {
      status: 'ENDED',
      endedAt,
      duration,
    });

    await this.callParticipantRepo
      .createQueryBuilder()
      .update()
      .set({ leftAt: endedAt })
      .where('callLogId = :callLogId', { callLogId })
      .andWhere('leftAt IS NULL')
      .execute();
    await this.createMessage({
      chatRoomId: callLog.chatRoomId,
      senderId: callLog.callerId,
      content: `${callLog.callType === 'VIDEO' ? 'Video' : 'Audio'} call - ${duration}s`,
      messageType: 'CALL_LOG',
      createdBy: callLog.callerId,
    });

    return await this.getCallLog(callLogId);
  }

  async getCallHistory(userId: string, limit = 20) {
    return await this.callLogRepo
      .createQueryBuilder('call')
      .leftJoinAndSelect('call.participants', 'participant')
      .leftJoinAndSelect('call.caller', 'caller')
      .leftJoinAndSelect('caller.employee', 'callerEmployee')
      .where('participant.userId = :userId', { userId })
      .orderBy('call.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    const members = await this.chatRoomMemberRepo.find({
      where: { userId, hasLeft: false },
    });

    let totalUnread = 0;

    for (const member of members) {
      const count = member.lastReadAt
        ? await this.chatMessageRepo
            .createQueryBuilder('msg')
            .where('msg.chatRoomId = :chatRoomId', {
              chatRoomId: member.chatRoomId,
            })
            .andWhere('msg.isDeleted = :isDeleted', { isDeleted: false })
            .andWhere('msg.senderId != :userId', { userId })
            .andWhere('msg.createdAt > :lastReadAt', {
              lastReadAt: member.lastReadAt,
            })
            .getCount()
        : await this.chatMessageRepo
            .createQueryBuilder('msg')
            .where('msg.chatRoomId = :chatRoomId', {
              chatRoomId: member.chatRoomId,
            })
            .andWhere('msg.isDeleted = :isDeleted', { isDeleted: false })
            .andWhere('msg.senderId != :userId', { userId })
            .getCount();

      totalUnread += count;
    }

    return totalUnread;
  }
}
