import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @ApiOperation({ summary: '发送邮件' })
  @Post('send')
  async sendEmail(@Body() createEmailDto: CreateEmailDto): Promise<void> {
    await this.emailService.sendVerificationCode(createEmailDto);
  }
  @ApiOperation({ summary: '给老婆发邮件' })
  @Post('send')
  async sendWifeEmail(@Body() object: any): Promise<void> {
    await this.emailService.sendEmail(object);
  }
}
