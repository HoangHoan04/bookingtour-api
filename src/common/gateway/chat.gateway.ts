import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/modules/chat/chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token.replace('Bearer ', ''));
      const userId = payload.uid || payload.sub || payload.id;

      if (!userId) {
        client.disconnect();
        return;
      }

      this.userSockets.set(userId, client.id);
      client.data.userId = userId;

      const rooms = await this.chatService.getUserChatRooms(userId);

      rooms.forEach((room) => {
        client.join(`room:${room.id}`);
      });

      this.server.emit('user:online', { userId });
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.userSockets.delete(userId);
      this.server.emit('user:offline', { userId });
    }
  }

  @SubscribeMessage('message:send')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      chatRoomId: string;
      content: string;
      messageType?: string;
    },
  ) {
    try {
      const userId = client.data.userId;
      const message = await this.chatService.createMessage({
        chatRoomId: data.chatRoomId,
        senderId: userId,
        content: data.content,
        messageType: data.messageType || 'TEXT',
        createdBy: userId,
      });
      this.server.to(`room:${data.chatRoomId}`).emit('message:new', {
        message,
      });

      return { success: true, data: message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('message:typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatRoomId: string; isTyping: boolean },
  ) {
    const userId = client.data.userId;
    client.to(`room:${data.chatRoomId}`).emit('user:typing', {
      userId,
      chatRoomId: data.chatRoomId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('message:read')
  async handleMessageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatRoomId: string; messageId: string },
  ) {
    const userId = client.data.userId;
    await this.chatService.markMessageAsRead(data.chatRoomId, userId);
    this.server.to(`room:${data.chatRoomId}`).emit('message:read', {
      userId,
      chatRoomId: data.chatRoomId,
    });
  }

  @SubscribeMessage('call:initiate')
  async handleInitiateCall(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      chatRoomId: string;
      callType: 'AUDIO' | 'VIDEO';
      recipientIds: string[];
    },
  ) {
    try {
      const callerId = client.data.userId;
      const callLog = await this.chatService.createCallLog({
        chatRoomId: data.chatRoomId,
        callerId,
        callType: data.callType,
        status: 'RINGING',
        createdBy: callerId,
      });

      data.recipientIds.forEach((recipientId) => {
        const recipientSocket = this.userSockets.get(recipientId);
        if (recipientSocket) {
          this.server.to(recipientSocket).emit('call:incoming', {
            callLogId: callLog.id,
            callerId,
            chatRoomId: data.chatRoomId,
            callType: data.callType,
          });
        }
      });

      return { success: true, callLogId: callLog.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('call:answer')
  async handleAnswerCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callLogId: string },
  ) {
    const userId = client.data.userId;
    await this.chatService.updateCallParticipant(data.callLogId, userId, {
      status: 'ANSWERED',
      joinedAt: new Date(),
    });

    const callLog = await this.chatService.getCallLog(data.callLogId);
    if (callLog) {
      const callerSocket = this.userSockets.get(callLog.callerId);
      if (callerSocket) {
        this.server.to(callerSocket).emit('call:answered', {
          callLogId: data.callLogId,
          userId,
        });
      }
    }
    return { success: true };
  }

  @SubscribeMessage('call:reject')
  async handleRejectCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callLogId: string },
  ) {
    const userId = client.data.userId;
    await this.chatService.updateCallParticipant(data.callLogId, userId, {
      status: 'REJECTED',
    });

    const callLog = await this.chatService.getCallLog(data.callLogId);
    if (callLog) {
      const callerSocket = this.userSockets.get(callLog.callerId);
      if (callerSocket) {
        this.server.to(callerSocket).emit('call:rejected', {
          callLogId: data.callLogId,
          userId,
        });
      }
    }
    return { success: true };
  }

  @SubscribeMessage('call:end')
  async handleEndCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callLogId: string },
  ) {
    const callLog = await this.chatService.endCall(data.callLogId);
    if (callLog) {
      this.server.to(`room:${callLog.chatRoomId}`).emit('call:ended', {
        callLogId: data.callLogId,
      });
    }
    return { success: true };
  }

  @SubscribeMessage('webrtc:offer')
  async handleWebRTCOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { recipientId: string; callLogId: string; offer: any },
  ) {
    const recipientSocket = this.userSockets.get(data.recipientId);
    if (recipientSocket) {
      this.server.to(recipientSocket).emit('webrtc:offer', {
        callLogId: data.callLogId,
        senderId: client.data.userId,
        offer: data.offer,
      });
    }
  }

  @SubscribeMessage('webrtc:answer')
  async handleWebRTCAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { recipientId: string; callLogId: string; answer: any },
  ) {
    const recipientSocket = this.userSockets.get(data.recipientId);
    if (recipientSocket) {
      this.server.to(recipientSocket).emit('webrtc:answer', {
        callLogId: data.callLogId,
        senderId: client.data.userId,
        answer: data.answer,
      });
    }
  }

  @SubscribeMessage('webrtc:ice-candidate')
  async handleICECandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { recipientId: string; callLogId: string; candidate: any },
  ) {
    const recipientSocket = this.userSockets.get(data.recipientId);
    if (recipientSocket) {
      this.server.to(recipientSocket).emit('webrtc:ice-candidate', {
        callLogId: data.callLogId,
        senderId: client.data.userId,
        candidate: data.candidate,
      });
    }
  }
}
