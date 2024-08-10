import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from '../common/schemas/chat.message.schema';
import { AuthService } from 'src/auth/auth.service';
import { viewMessagesParam } from './interface/viewMessages.interface';
import { SendMessageDto } from './dto/send-message.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    private authService: AuthService,
    @Inject('MESSAGE_SERVICE')
    private messageClient: ClientProxy,
  ) {}

  // async sendMessage(id: string, sendMessageDto: SendMessageDto) {
  //   const senderUser = await this.authService.findById(id);
  //   const recipientUser = await this.authService.findOne(
  //     sendMessageDto.recipient,
  //   );

  //   if (!senderUser || !recipientUser) {
  //     throw new Error('Sender or recipient not found');
  //   }

  //   const message = new this.messageModel({
  //     sender: senderUser._id,
  //     recipient: recipientUser._id,
  //     content: sendMessageDto.content,
  //   });

  //   return message.save();
  // }

  async sendMessage(senderId: string, sendMessageDto: SendMessageDto) {
    try {
      const { receiver, message } = sendMessageDto;

      const senderUser = await this.authService.findById(senderId);
      if (!senderUser) throw new BadRequestException('Sender not found');

      const receiverUser = await this.authService.findOne(receiver);
      if (!receiverUser) throw new BadRequestException('Receiver not found');

      const newMessage = new this.messageModel({
        sender: senderUser._id,
        receiver: receiverUser._id,
        message,
      });

      const savedMessage = await newMessage.save();

      // Publish message to RabbitMQ
      this.messageClient.emit('message_sent', {
        sender: senderId,
        receiver: receiverUser._id,
        message: message,
      });

      const result = {
        id: savedMessage._id,
        sender: {
          senderId: savedMessage.sender,
          senderName: senderUser.username,
        },
        receiver: {
          receiverId: savedMessage.receiver,
          receiverName: receiverUser.username,
        },
        message,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }

  // async viewMessages(id: string, params: viewMessagesParam) {
  //   const user = await this.authService.findById(id);
  //   const otherUser = await this.authService.findOne(params.otherUsername);

  //   if (!user || !otherUser) {
  //     throw new Error('User not found');
  //   }

  //   const messages = await this.messageModel
  //     .find({
  //       $or: [
  //         { sender: user._id, recipient: otherUser._id },
  //         { sender: otherUser._id, recipient: user._id },
  //       ],
  //     })
  //     .sort({ createdAt: -1 })
  //     .skip((params.page - 1) * params.limit)
  //     .limit(params.limit)
  //     .populate('sender', 'username')
  //     .populate('recipient', 'username')
  //     .exec();

  //   return messages.reverse();
  // }
  async viewMessages(userId: string, query: viewMessagesParam) {
    try {
      const { toUserId, username, page, limit } = query;

      if (!toUserId && !username) {
        if (!toUserId)
          throw new BadRequestException(
            'another userId to be seen is not valid',
          );
        if (!username)
          throw new BadRequestException(
            'another username to be seen is not valid',
          );
      }

      const thisUser = await this.authService.findById(userId);

      let fromUser: Record<string, any> | null = null;
      if (username) {
        fromUser = await this.authService.findOne(username);
      }
      if (toUserId) {
        fromUser = await this.authService.findById(toUserId);
      }
      // const fromUser = await this.authService.findById(
      //   '66b60a489c0efeaed23457df',
      // );
      console.log('idUserFrom :', fromUser._id);
      console.log('thisUser :', thisUser);
      console.log('fromUser:', fromUser);

      // Ensure that the sender and receiver IDs are ObjectId instances
      const thisUserId = new Types.ObjectId(thisUser._id);
      const fromUserId = new Types.ObjectId(fromUser._id);

      // const messages = await this.messageModel
      //   .find({
      //     receiver: userId,
      //   })
      //   .sort({ timestamp: -1 })
      //   .skip((query.page - 1) * query.limit)
      //   .limit(query.limit)
      // .populate('sender', 'username')
      // .populate('recipient', 'username')
      // .exec();

      const messages = await this.messageModel.find({
        // sender: { $in: [fromUserId] },
        // receiver: { $in: [thisUserId] },
        // sender: fromUserId,
        receiver: thisUserId,
      });
      // .sort({ timestamp: -1 })
      // .skip((query.page - 1) * query.limit)
      // .limit(query.limit)
      // .exec();

      // const messages = await this.messageModel
      //   .find({
      //     $or: [
      //       { sender: thisUserId, receiver: fromUserId },
      //       { sender: fromUserId, receiver: thisUserId },
      //     ],
      //   })
      //   .sort({ createdAt: -1 })
      //   .skip((query.page - 1) * query.limit)
      //   .limit(query.limit)
      //   .populate('sender', 'userId')
      //   .populate('receiver', 'userId')
      //   .exec();

      console.log('messages :', messages);
      // return messages.reverse();
      if (!messages)
        throw new NotFoundException('No Messages Found from this user');

      const results = messages.map((message) => ({
        _id: message._id,
        sender: {
          senderId: message.sender,
          senderName: fromUser.username,
        },
        receiver: {
          receiverId: message.receiver,
          receiverName: thisUser.username,
        },
        message: message.message,
        read: message.read,
        // createdAt: message.createdAt,
        // updatedAt: message.updatedAt,
      }));

      return results;
    } catch (error) {
      throw error;
    }
  }

  async markAsRead(messageId: string, username: string) {
    const user = await this.authService.findOne(username);
    if (!user) {
      throw new Error('User not found');
    }

    return this.messageModel
      .findOneAndUpdate(
        { _id: messageId, recipient: user._id },
        { read: true },
        { new: true },
      )
      .exec();
  }
}
