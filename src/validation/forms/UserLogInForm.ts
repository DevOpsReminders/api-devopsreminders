import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsString, Length } from 'class-validator';

export default class UserLogInForm {
    @Expose()
    @IsDefined()
    @IsString()
    @IsEmail()
    email!: string;

    @Expose()
    @IsDefined()
    @IsString()
    @Length(8, 32)
    password!: string;
}
