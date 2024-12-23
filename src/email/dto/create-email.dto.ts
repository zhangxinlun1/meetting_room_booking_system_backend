import { ApiProperty } from '@nestjs/swagger';

export class CreateEmailDto {
  @ApiProperty({
    description: 'Email address',
    example: 'test@example.com',
  })
  address: string;
}
