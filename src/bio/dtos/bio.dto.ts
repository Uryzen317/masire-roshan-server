import { IsString, IsNotEmpty, IsArray, ArrayMinSize, ArrayMaxSize, MinLength, MaxLength, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';
import { Achievement, Skill, CallInfo } from './bio.class';

export class SetDto{
  @IsString()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64, { each: true , message: 'حداکثر طول توضیحات $constraint1 کاراکتر است' })
  bio: string;
  
  @IsArray({ message: 'مقدار مناسبی وارد کنید' }) // enter a proper value
  @ArrayMinSize(0 , { message: 'مقدار مناسبی وارد کنید' })
  @ArrayMaxSize(20, { message: 'تعداد اهداف نباید بیشنر از $constraint1 مورد باشد' })
  @IsString({ each: true, message: 'مقدار مناسبی وارد کنید' })
  @MinLength(1, { each: true , message: 'حداقل طول هر هدف $constraint1 کاراکتر است' })
  @MaxLength(64, { each: true , message: 'حداکثر طول هر هدف $constraint1 کاراکتر است' })
  goals: string[];
  
  @IsArray({ message: 'مقدار مناسبی وارد کنید' })
  @ArrayMinSize(0 , { message: 'مقدار مناسبی وارد کنید' })
  @ArrayMaxSize(20, { message: 'حداکثر تعداد دستاورد $constraint1 مورد است' })
  @ValidateNested({ each: true })
  @Type(()=> Achievement )
  achievements: Achievement[];
  
  @IsArray({ message: 'مقدار مناسبی وارد کنید' })
  @ArrayMinSize(0, { message: 'مقدار مناسبی وارد کنید' })
  @ArrayMaxSize(20, { message: 'حداکثر تعداد مهارات $constraint1 مورد است' })
  @ValidateNested({ each: true })
  @Type(()=> Skill)
  skills: Skill[];
  
  @IsArray({ message: 'مقدار مناسبی وارد کنید' })
  @ArrayMinSize(0, { message: 'مقدار مناسبی وارد کنید' })
  @ArrayMaxSize(20, { message: 'حداکثر تعداد مشخصات تماس $constraint1 مورد است' })
  @ValidateNested({ each: true })
  @Type(()=> CallInfo)
  callInfo: CallInfo[];
  
  @IsString({ message: 'مقدار مناسبی وارد کنید' })
  @IsNotEmpty({ message: 'مقدار مناسبی وارد کنید' })
  @MaxLength(64, { message: 'مقدار مناسبی وارد کنید' })
  background: string;
}
