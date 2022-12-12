import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ClassConstructor } from 'class-transformer';
import AppBaseEntity from '@database/core/AppBaseEntity';
import { dbConnect } from '@database/connect';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

type IsUniqueInDbValidationOptions<Entity extends AppBaseEntity = AppBaseEntity> = {
    entity: ClassConstructor<Entity>;
    field: keyof Entity;
};

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
                    const { entity, field } = isUniqueInDbValidationOptions;
                    const ds = await dbConnect();
                    const countOptions = {
                        [field]: value,
                    };
                    const count = await ds.manager.countBy(entity, countOptions as FindOptionsWhere<Entity>);
                    return count === 0;
                },
                defaultMessage({ property, value }: ValidationArguments): string {
                    return `The ${property} ${value} already exists`;
                },
            },
        });
    };
};
