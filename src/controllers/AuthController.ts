import { Controller, Post, Request, Response, All } from '@decorators/express';
import * as e from 'express';
import { UserEntity } from '@entities/UserEntity';
import ObjectValidator from '@validation/ObjectValidator';
import UserRegistrationForm from '@validation/forms/UserRegistrationForm';
import UserLogInForm from '@validation/forms/UserLogInForm';
import AuthRestrictMiddleware from '@server/middleware/AuthRestrictMiddleware';

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
                body: req.body,
                data: validation.formInstance,
                errors: validation.errorCollection.errors,
            });
        }
    }

    @Post('/email/login')
    async login(@Request() req: e.Request, @Response() res: e.Response) {
        const validation = await ObjectValidator.validate(req.body, UserLogInForm);
        const { email, password } = validation.formInstance;
        let passwordMatches = false;
        let user: UserEntity | null = null;

        if (validation.isValid) {
            user = await UserEntity.findOneBy({ email });
            passwordMatches = user ? user.isValidPassword(password) : false;
        }

        if (validation.isValid && passwordMatches && user) {
            res.status(200).json(user.toAuthPayload());
        } else {
            res.status(400).json({
                body: req.body,
                data: validation.formInstance,
                errors: validation.errorCollection.errors,
            });
        }
    }

    @All('/status', [AuthRestrictMiddleware])
    async status(@Request() req: e.Request, @Response() res: e.Response) {
        res.json({
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
        });
    }
}
