import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../email/email.service';
import { RedisService } from '../redis/redis.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendEmail({
      to: address,
      subject: '注册验证码',
      html: `<h1>你的注册验证码是${code}</h1>`,
    });
    return '发送成功';
  }

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    console.log(registerUser);
    return this.userService.register(registerUser);
  }

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'done';
  }
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    console.log(loginUser);
    await this.userService.login(loginUser, false);
    return 'success';
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    console.log(loginUser);
    return 'success';
  }
}
