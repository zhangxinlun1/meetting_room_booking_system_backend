import { IsNotEmpty } from 'class-validator';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    description: '用户名',
    example: '张xx',
  })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;
  @ApiProperty({
    description: '昵称',
    example: '小x',
  })
  @IsNotEmpty({
    message: '昵称不能为空',
  })
  nickName: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @ApiProperty({
    description: '密码',
    example: 'xxxx',
  })
  password: string;
  @ApiProperty({
    description: '邮箱',
    example: 'xxxxxxx@qq.com',
  })
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  email: string;
  @ApiProperty({
    description: '验证码',
    example: 'xxxx',
  })
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}

export class LoginUserDto {
  @ApiProperty({
    description: 'username',
    example: 'xxxx',
  })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;
  @ApiProperty({
    description: 'password',
    example: 'xxxx',
  })
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}
interface UserInfo {
  id: number;

  username: string;

  nickName: string;

  email: string;

  headPic: string;

  phoneNumber: string;

  isFrozen: boolean;

  isAdmin: boolean;

  createTime: any;

  roles: string[];

  permissions: string[];
}
export class LoginUserVo {
  userInfo: UserInfo;

  accessToken: string;

  refreshToken: string;
}
export class emailAdress {
  @ApiProperty({
    description: '邮箱地址',
    example: '19244743@qq.com',
  })
  address: string;
}
