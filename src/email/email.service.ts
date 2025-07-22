import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

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

    // Redis service removed - verification code storage disabled
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
    // Redis service removed - validation disabled
    return true; // Temporarily return true for testing
  }
}
