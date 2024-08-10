import { IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  // @IsNotEmpty()
  // sender: string;

  @IsNotEmpty()
  receiver: string;

  @IsNotEmpty()
  message: string;
}
