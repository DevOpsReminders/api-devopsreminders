import { Expose } from 'class-transformer';
import { IsDefined, IsString, Length } from 'class-validator';
import EmailForm from '@validation/forms/EmailForm';

export default class UserForm extends EmailForm {
    @Expose()
    @IsDefined()
    @IsString()
    @Length(8, 32)
    password!: string;
}
