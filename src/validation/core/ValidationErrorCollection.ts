import { ValidationError } from 'class-validator';

export default class ValidationErrorCollection {
    errors: ValidationError[];

    constructor(errors: ValidationError[]) {
        this.errors = errors;
    }
}
