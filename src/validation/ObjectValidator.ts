import ValidationErrorCollection from './core/ValidationErrorCollection';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { validate } from 'class-validator';

export default class ObjectValidator<Form extends object = object, Data = object> {
    data: Data;
    formClass: ClassConstructor<Form>;
    formInstance: Form;
    errorCollection: ValidationErrorCollection;
    isValid = false;

    static async validate<Form extends object = object, Data = object>(
        data: Data,
        formClass: ClassConstructor<Form>,
    ): Promise<ObjectValidator<Form, Data>> {
        const objectValidator = new ObjectValidator(data, formClass);
        await objectValidator.validate();
        return objectValidator;
    }

    constructor(data: Data, formClass: ClassConstructor<Form>) {
        this.data = data;
        this.formClass = formClass;
        this.formInstance = plainToInstance(this.formClass, this.data, {
            strategy: 'excludeAll',
        });
        this.errorCollection = new ValidationErrorCollection([]);
    }

    async validate() {
        const errors = await validate(this.formInstance, {
            validationError: { target: false },
            skipMissingProperties: true,
        });
        this.errorCollection = new ValidationErrorCollection(errors);
        this.isValid = errors.length === 0;
    }
}
