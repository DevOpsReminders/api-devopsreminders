import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ClassConstructor } from 'class-transformer';
import AppBaseEntity from '@database/core/AppBaseEntity';
import { dbConnect } from '@database/connect';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

type IsUniqueInDbValidationOptions<Entity extends AppBaseEntity = AppBaseEntity> = {
    entity: ClassConstructor<Entity>;
    field: keyof Entity;
};

export const IsUniqueInDbErrorMessage = (property: string, value: string | number) =>
    `The ${property} ${value} already exists`;

export const IsUniqueInDb = <Entity extends AppBaseEntity = AppBaseEntity>(
    isUniqueInDbValidationOptions: IsUniqueInDbValidationOptions<Entity>,
    validationOptions?: ValidationOptions,
) => {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            async: true,
            name: 'isUniqueInDb',
            validator: {
                async validate(value: string | number): Promise<boolean> {
                    if (!value) return false;
                    const { entity, field } = isUniqueInDbValidationOptions;
                    const ds = await dbConnect();
                    const where = {
                        [field]: value,
                    } as FindOptionsWhere<Entity>;
                    const exists = await ds.manager.exists(entity, {
                        where,
                    });
                    return !exists;
                },
                defaultMessage({ property, value }: ValidationArguments): string {
                    return IsUniqueInDbErrorMessage(property, value);
                },
            },
        });
    };
};
