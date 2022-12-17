import { Controller, Post, Request, Response, All, Get } from '@decorators/express';
import * as e from 'express';
import { UserEntity } from '@entities/UserEntity';
import ObjectValidator from '@validation/ObjectValidator';
import UserRegistrationForm from '@validation/forms/UserRegistrationForm';
import UserLogInForm from '@validation/forms/UserLogInForm';
import AuthRestrictMiddleware from '@server/middleware/AuthRestrictMiddleware';
import EmailConfirmationService from '@services/EmailConfirmationService';

@Controller('/auth')
export class AuthController {
    @Post('/email/register')
    async register(@Request() req: e.Request, @Response() res: e.Response) {
        const validation = await ObjectValidator.validate(req.body, UserRegistrationForm);
        if (validation.isValid) {
            const user = UserEntity.create(validation.formInstance as UserEntity);
            user.encryptPassword();
            await user.save();
            res.status(200).json(user.toAuthPayload());
        } else {
            res.status(400).json({
                data: validation.formInstance,
                errors: validation.errorCollection.errors,
            });
        }
    }

    @Post('/email/login')
    async login(@Request() req: e.Request, @Response() res: e.Response) {
        const validation = await ObjectValidator.validate(req.body, UserLogInForm);
        if (validation.isValid) {
            const user = await UserEntity.findOneByOrFail({
                email: validation.formInstance.email,
            });
            res.status(200).json(user.toAuthPayload());
        } else {
            res.status(400).json({
                data: validation.formInstance,
                errors: validation.errorCollection.errors,
            });
        }
    }

    @Get('/email/confirm/:confirmationCode')
    async confirm(@Request() req: e.Request, @Response() res: e.Response) {
        const { confirmationCode } = req.params;
        const result = EmailConfirmationService.getInstance().verifyEmail(confirmationCode);
        res.status(200).json({ confirmationCode, result });
    }

    @All('/status', [AuthRestrictMiddleware])
    async status(@Request() req: e.Request, @Response() res: e.Response) {
        res.json({
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
        });
    }
}
