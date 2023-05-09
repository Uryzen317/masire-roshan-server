import { IsString, MinLength, MaxLength, IsNumber, Min, Max, Validate,
  ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments,
} from 'class-validator';

export class Achievement {
  @IsString({ message: 'مقدار مناسبی وارد کنید' })
  @MinLength(1, { each: true , message: 'حداقل طول هر دستاورد $constraint1 کاراکتر است' })
  @MaxLength(64, { each: true , message: 'حداکثر طول هر دستاورد $constraint1 کاراکتر است' })
  achievement: string;
  
  @IsString({ message: 'مقدار مناسبی وارد کنید' })
  @MinLength(1, { each: true , message: 'مقدار مناسبی وارد کنید' })
  @MaxLength(64, { each: true , message: 'مقدار مناسبی وارد کنید' })
  avatar: string;
}

export class Skill {
  @IsString({ message: 'مقدار مناسبی وارد کنید' })
  @MinLength(1, { each: true , message: 'حداقل طول هر مهارت $constraint1 کاراکتر است' })
  @MaxLength(64, { each: true , message: 'حداکثر طول هر مهارت $constraint1 کاراکتر است' })
  skill: string;

  @IsNumber({}, { message: 'مقدار مناسبی وارد کنید' })
  @Min(0, { message: 'مقدار مهارت باید بین ۰ تا ۱۰۰ باشد' })
  @Max(100, { message: 'مقدار مهارت باید بین ۰ تا ۱۰۰ باشد' })
  value: number;
}

@ValidatorConstraint({ async: false })
export class CallInfoPlatformValidator implements ValidatorConstraintInterface {
  allowedPlatforms : string[] = ['telegram', 'instagram', 'email'];

  validate(platform: string, args: ValidationArguments) {
    return this.allowedPlatforms.find((ap)=> ap === platform ) ? true : false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'مقدار معتبری وارد کنید';
  }
}

export class CallInfo {
  @IsString({ message: 'مقدار مناسبی وارد کنید' })
  @MinLength(1, { each: true , message: 'مقدار مناسبی وارد کنید' })
  @MaxLength(64, { each: true , message: 'مقدار مناسبی وارد کنید' })
  @Validate(CallInfoPlatformValidator)
  platform: string = 'telegram';
  
  @IsString({ message: 'مقدار مناسبی وارد کنید' })
  @MaxLength(64, { each: true , message: 'طول مشخصات تماس باید کمتر از $constraint1 کاراکتر باشد' })
  value: string;
}
