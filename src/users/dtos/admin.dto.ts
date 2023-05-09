import { IsString } from "class-validator";

export class AdminDto {
    @IsString()
    accessToken : string ;
    
    @IsString()
    id : string;
}