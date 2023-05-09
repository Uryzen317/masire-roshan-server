import { IsString } from "class-validator";

export class SearchAdminsDto {
    @IsString()
    accessToken : string ;
    
    @IsString()
    name : string;
}