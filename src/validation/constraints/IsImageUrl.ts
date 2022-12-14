import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import isImage from 'is-image-header';
import { isString } from 'lodash';

export function IsImageUrl(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            async: true,
            name: 'isImageUrl',
            validator: {
                async validate(url: string): Promise<boolean> {
                    if (!url || !isString(url)) return false;

                    return isImage(url);
                },
                defaultMessage({ property }: ValidationArguments): string {
                    return `${property} is not a valid image url`;
                },
            },
        });
    };
}
