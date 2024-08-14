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
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../email/email.service';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject(RedisService)
  private redisService: RedisService;
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendEmail({
      to: address,
      subject: '张鑫伦的爱',
      html: `<h1>我爱郑文莉</h1>`,
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

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, false);
      const access_token = this.jwtService.sign(
        {
          userId: data.userId,
          username: data.username,
          roles: data.roles,
          permissions: data.permissions,
        },
        {
          expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
        },
      );
      const refresh_token = this.jwtService.sign(
        {
          userId: data.userId,
        },
        {
          expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        },
      );
      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效,请重新登录');
    }
  }

  @Get('admin/refresh')
  async radminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, true);
      const access_token = this.jwtService.sign(
        {
          userId: data.userId,
          username: data.username,
          roles: data.roles,
          permissions: data.permissions,
        },
        {
          expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
        },
      );
      const refresh_token = this.jwtService.sign(
        {
          userId: data.userId,
        },
        {
          expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        },
      );
      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效,请重新登录');
    }
  }
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    console.log(loginUser);
    return await this.userService.login(loginUser, false);
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    console.log(loginUser);
    return 'success';
  }
}
