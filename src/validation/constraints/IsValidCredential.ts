import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ClassConstructor } from 'class-transformer';
import AppBaseEntity from '@database/core/AppBaseEntity';
import { dbConnect } from '@database/connect';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import get from 'lodash/get';
import bcrypt from 'bcrypt';

type IsValidCredentialValidationOptions<Entity extends AppBaseEntity = AppBaseEntity> = {
    entity: ClassConstructor<Entity>;
    usernameField: keyof Entity;
    passwordField: keyof Entity;
};

export const IsValidCredential = <Entity extends AppBaseEntity = AppBaseEntity>(
    isValidCredentialValidationOptions: IsValidCredentialValidationOptions<Entity>,
    validationOptions?: ValidationOptions,
) => {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            async: true,
            name: 'isValidCredential',
            validator: {
                async validate(password: string, validationArguments?: ValidationArguments): Promise<boolean> {
                    const { entity, usernameField, passwordField } = isValidCredentialValidationOptions;
                    const username = get(validationArguments, ['object', usernameField]);
                    if (!password || !username) return false;
                    const ds = await dbConnect();
                    const where = {
                        [usernameField]: username,
                    } as FindOptionsWhere<Entity>;
                    const user = await ds.manager.findOneBy(entity, where);
                    if (!user) return false;
                    const hashedPassword = get(user, passwordField);
                    return bcrypt.compare(password, String(hashedPassword));
                },
                defaultMessage(): string {
                    return 'Invalid Credentials';
                },
            },
        });
    };
};
