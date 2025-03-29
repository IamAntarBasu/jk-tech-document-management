import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserLoginValidation {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
