import { IsString } from "class-validator";

export class BanDto {
    @IsString()
    accessToken : string ;
    
    @IsString()
    id : string;
}
