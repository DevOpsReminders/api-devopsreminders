import { Expose } from 'class-transformer';
import { IsDefined, IsOptional, IsString, Length } from 'class-validator';
import { IsUniqueInDb } from '@validation/constraints/IsUniqueInDb';
import { IsImageUrl } from '@validation/constraints/IsImageUrl';
import { UserEntity } from '@entities/UserEntity';
import UserForm from '@validation/forms/UserForm';

export default class UserRegistrationForm extends UserForm {
    @Expose()
    @IsDefined()
    @IsString()
    @Length(10, 20)
    name!: string;

    @IsUniqueInDb<UserEntity>({
        entity: UserEntity,
        field: 'email',
    })
    email!: string;

    @Expose()
    @IsOptional()
    @IsImageUrl()
    avatar?: string;
}
