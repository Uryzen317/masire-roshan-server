import {
  IsEmail,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ChangeUsernameDto {
  @IsString()
  @MinLength(5, { message: 'حداقل طول مجاز 5 کاراکتر است' })
  @MaxLength(74, { message: 'حداکثر طول مجاز 74 کاراکتر است' })
  value: string;

  @IsString()
  accessToken: string;
}

export class ChangeEmailDto {
  @IsEmail({}, { message: 'ایمیل معتبر نیست' })
  @MinLength(5, { message: 'حداقل طول مجاز 5 کاراکتر است' })
  @MaxLength(74, { message: 'حداکثر طول مجاز 74 کاراکتر است' })
  value: string;

  @IsString()
  accessToken: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(5, { message: 'حداقل طول مجاز 5 کاراکتر است' })
  @MaxLength(64, { message: 'حداکثر طول مجاز 64 کاراکتر است' })
  value: string;

  @IsString()
  accessToken: string;
}

export class ChangeFirstnameDto {
  @IsString()
  @MinLength(3, { message: 'حداقل طول مجاز 3 کاراکتر است' })
  @MaxLength(74, { message: 'حداکثر طول مجاز 64 کاراکتر است' })
  value: string;

  @IsString()
  accessToken: string;
}

export class ChangeLastnameDto {
  @IsString()
  @MinLength(3, { message: 'حداقل طول مجاز 3 کاراکتر است' })
  @MaxLength(74, { message: 'حداکثر طول مجاز 64 کاراکتر است' })
  value: string;

  @IsString()
  accessToken: string;
}

export class ChangeNumberDto {
  @IsNumber()
  @Min(9000000000, { message: 'حداقل طول مجاز 10 کاراکتر است' })
  @Max(9999999999, { message: 'حداکثر طول مجاز 11 کاراکتر است' })
  value: number;

  @IsString()
  accessToken: string;
}
