import { ValidationError } from 'class-validator';

const buildValidationError = (
    value: unknown,
    property: string,
    constraints: {
        [type: string]: string;
    },
): ValidationError => {
    return Object.assign(new ValidationError(), {
        value: value,
        property,
        children: [],
        constraints,
    });
};

export default buildValidationError;
