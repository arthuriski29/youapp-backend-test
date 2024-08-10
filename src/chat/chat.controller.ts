// import {
//   Controller,
//   Post,
//   Body,
//   UseGuards,
//   Request,
//   Get,
//   Query,
//   Put,
//   Param,
// } from '@nestjs/common';
// import { ChatService } from './chat.service';
// import { JwtAuthGuard } from 'src/common/guard/jwt.guards';

// @Controller('chat')
// export class ChatController {
//   constructor(private chatService: ChatService) {}

//   @UseGuards(JwtAuthGuard)
//   @Post('send')
//   async sendMessage(
//     @Request() req,
//     @Body() messageDto: { recipient: string; content: string },
//   ) {
//     await this.chatService.sendMessage(
//       req.user.username,
//       messageDto.recipient,
//       messageDto.content,
//     );
//     return { success: true };
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('messages')
//   async getMessages(
//     @Request() req,
//     @Query('otherUser') otherUser: string,
//     @Query('page') page: 1,
//     @Query('limit') limit: 20,
//   ) {
//     return this.chatService.getMessages(
//       req.user.username,
//       otherUser,
//       page,
//       limit,
//     );
//   }

//   @UseGuards(JwtAuthGuard)
//   @Put('messages/:messageId/read')
//   async markAsRead(@Request() req, @Param('messageId') messageId: string) {
//     return this.chatService.markAsRead(messageId, req.user.username);
//   }
// }
import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt.guards';
import { CustomRequest } from 'src/common/interface/custom-request.interface';
import { viewMessagesParam } from './interface/viewMessages.interface';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('viewMessages')
  async viewMessages(
    @Req() req: CustomRequest,
    @Query() query: viewMessagesParam,
  ) {
    const { id } = req.user;
    return this.chatService.viewMessages(id, query);
  }

  @Post('sendMessage')
  async sendMessage(
    @Req() req: CustomRequest,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    const { id } = req.user;
    return this.chatService.sendMessage(id, sendMessageDto);
  }
}
