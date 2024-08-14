import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
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
}
