import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor() {}
  @Cron(CronExpression.EVERY_2_HOURS)
  handleCron() {
    this.logger.log('每2_HOURS执行一次的定时任务开始执行');
    axios.get(
      'http://localhost:3333/user/register-captcha?address=329017036@qq.com',
    );
  }
}
