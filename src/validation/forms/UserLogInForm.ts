import UserForm from '@validation/forms/UserForm';
import { UserEntity } from '@entities/UserEntity';
import { IsValidCredential } from '@validation/constraints/IsValidCredential';

export default class UserLogInForm extends UserForm {
    @IsValidCredential<UserEntity>({
        entity: UserEntity,
        usernameField: 'email',
        passwordField: 'password',
    })
    password!: string;
}
