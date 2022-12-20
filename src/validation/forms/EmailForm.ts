import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export default class EmailForm {
    @Expose()
    @IsDefined()
    @IsString()
    @IsEmail()
    email!: string;
}
