import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { RedisService } from '../redis/redis.service';
import { CreateEmailDto } from './dto/create-email.dto';
@Injectable()
export class EmailService {
  transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '19244743@qq.com',
        pass: 'iztllbvwqnldcbbi',
      },
    });
  }

  @Inject(RedisService)
  private redisService: RedisService;
  async sendEmail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '每日一爱',
        address: '19244743@qq.com',
      },
      to,
      subject,
      html,
    });
  }
  async sendVerificationCode(email: CreateEmailDto): Promise<void> {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const key = `verification:${email.address}`;

    // 将验证码存储到 Redis 中，设置过期时间为 5 分钟（300 秒）
    await this.redisService.set(key, verificationCode, 30000);
    console.log({ key, email, verificationCode });
    await this.transporter.sendMail({
      from: {
        name: '验证码',
        address: '19244743@qq.com',
      },
      to: email,
      subject: '验证码',
      html: `<h1>您的验证码是：${verificationCode}，有效期为 5 分钟。</h1>`,
    });
    // 发送邮件
    // await this.mailService.sendMail({
    //   to: email,
    //   subject: '验证码',
    //   text: `您的验证码是：${verificationCode}，有效期为 5 分钟。`,
    // });
  }
  async validateVerificationCode(
    email: string,
    code: string,
  ): Promise<boolean> {
    const key = `verification:${email}`;
    const storedCode = await this.redisService.get(key);
    console.log({ storedCode });
    if (storedCode === code) {
      // 验证成功后删除 Redis 中的验证码
      await this.redisService.del(key);
      return true;
    }
    throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
  }
}
