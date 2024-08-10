// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.users.forEach((value, key) => {
      if (value === client.id) {
        this.users.delete(key);
      }
    });
  }

  @SubscribeMessage('register')
  handleRegister(client: Socket, userId: string) {
    this.users.set(userId, client.id);
  }

  @SubscribeMessage('send_message')
  handleSendMessage(
    client: Socket,
    payload: { receiverId: string; message: string },
  ) {
    const receiverSocketId = this.users.get(payload.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receive_message', payload);
    }
  }
}
