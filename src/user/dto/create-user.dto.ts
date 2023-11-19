import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Role } from '../../enums/role.enum';

export class createUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  // o padrão de cada parametro é 1
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;

  @IsOptional()
  @IsDateString()
  birthAt?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: number;
}
