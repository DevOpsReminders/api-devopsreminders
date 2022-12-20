import ObjectValidator from '@validation/ObjectValidator';
import * as e from 'express';
import { ClassConstructor } from 'class-transformer/types/interfaces';

type FormCallbackResult = {
    status: number;
    body: Record<string, unknown>;
};

export default class ProcessRequestForm {
    static async validate<Form extends object = object, Data = object>(
        req: e.Request,
        res: e.Response,
        formClass: ClassConstructor<Form>,
        isValidCallback: (validation: ObjectValidator<Form, Data>) => FormCallbackResult | Promise<FormCallbackResult>,
    ) {
        const validation = await ObjectValidator.validate<Form, Data>(req.body, formClass);
        if (validation.isValid) {
            const { status, body } = await isValidCallback(validation);
            res.status(status).json(body);
        } else {
            res.status(400).json({
                data: validation.formInstance,
                errors: validation.errorCollection.errors,
            });
        }
    }
}
