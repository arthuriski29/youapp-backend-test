// src/chat/chat-listener.service.ts
import { Injectable } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Injectable()
export class ChatListenerService {
  // @MessagePattern('message_sent')
  @EventPattern('message_sent')
  async handleMessageSent(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(`Message received: ${JSON.stringify(data)}`);
    // Here you can implement additional logic, like storing the message in the database
    // or triggering notifications
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
