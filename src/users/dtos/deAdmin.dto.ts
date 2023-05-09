import { IsString } from "class-validator";

export class DeAdminDto {
    @IsString()
    accessToken : string ;
    
    @IsString()
    id : string;
}