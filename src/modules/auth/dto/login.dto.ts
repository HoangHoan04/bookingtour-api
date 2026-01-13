import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
