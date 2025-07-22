import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  emailAdress,
  LoginUserDto,
  RegisterUserDto,
} from './dto/create-user.dto';
import { EmailService } from '../email/email.service';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEmailDto } from '../email/dto/create-email.dto';
import { WeatherService } from '../weather/weather.service';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;



  @Inject(WeatherService)
  private weatherService: WeatherService;
  @ApiOperation({ summary: '给老婆发邮件' })
  @Get('register-captcha')
  async captcha(@Query('address') address: emailAdress) {
    try {
      const weatherData = await this.weatherService.getWeatherByName();
      const code = Math.random().toString().slice(2, 8);
      // Redis service removed
      const moment = require('moment');
      const formattedDate = moment(weatherData.updateTime).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      console.log(formattedDate);
      await this.emailService.sendEmail({
        to: address,
        subject: '张鑫伦的爱',
        html: `<h1>我爱郑文莉</h1>
        <h4>天气更新时间为${formattedDate}</h4>
        <p>天气状态为:${weatherData.now.text}</p>
        <p>当前温度是:${weatherData.now.temp}°</p>
        <p>体感温度:${weatherData.now.feelsLike}°</p>
        <p>降水量:${weatherData.now.precip}</p>
        <p>云量:${weatherData.now.cloud}</p>`,
      });
      return '发送成功';
    } catch (err) {
      throw new Error(err);
    }
  }
  @ApiOperation({ summary: '用户注册' })
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    console.log(registerUser, 'create User');
    const captcha = await this.emailService.validateVerificationCode(
      registerUser.email,
      registerUser.captcha,
    );
    console.log({ captcha });
    if (!captcha) return false;
    return this.userService.register(registerUser);
  }
  @ApiOperation({ summary: '初始化一些用户' })
  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'done';
  }
  @ApiOperation({ summary: 'token刷新' })
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

  @ApiOperation({ summary: 'admin的token刷新' })
  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
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
  @ApiOperation({ summary: '用户登录' })
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    console.log(loginUser);
    return await this.userService.login(loginUser, false);
  }
  @ApiOperation({ summary: '用户邮箱发送验证码' })
  @Post('captcha')
  async userEmailCaptcha(@Body() CreateEmailDto: CreateEmailDto) {
    return await this.emailService.sendVerificationCode(CreateEmailDto);
  }
  @ApiOperation({ summary: 'admin用户登录' })
  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    console.log(loginUser);
    return 'success';
  }
}
