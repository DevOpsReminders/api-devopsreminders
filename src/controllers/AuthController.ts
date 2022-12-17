import { All, Controller, Get, Post, Request, Response } from '@decorators/express';
import * as e from 'express';
import { UserEntity } from '@entities/UserEntity';
import UserRegistrationForm from '@validation/forms/UserRegistrationForm';
import UserLogInForm from '@validation/forms/UserLogInForm';
import AuthRestrictMiddleware from '@server/middleware/AuthRestrictMiddleware';
import EmailConfirmationService from '@services/EmailConfirmationService';
import buildValidationError from '@validation/core/buildValidationError';
import ProcessRequestForm from '@validation/ProcessRequestForm';

@Controller('/auth')
export class AuthController {
    @Post('/email/register')
    register(@Request() req: e.Request, @Response() res: e.Response) {
        return ProcessRequestForm.validate(req, res, UserRegistrationForm, async validation => {
            const user = UserEntity.create(validation.formInstance as UserEntity);
            user.encryptPassword();
            await user.save();
            await EmailConfirmationService.getInstance().sendEmail(user);
            return {
                status: 200,
                body: {
                    status: 'userCreated',
                    message: 'email confirmation sent',
                },
            };
        });
    }

    @Post('/email/login')
    login(@Request() req: e.Request, @Response() res: e.Response) {
        return ProcessRequestForm.validate(req, res, UserLogInForm, async validation => {
            const user = await UserEntity.findOneByOrFail({
                email: validation.formInstance.email,
            });
            return user.emailConfirmed
                ? {
                      status: 200,
                      body: user.toAuthPayload(),
                  }
                : {
                      status: 400,
                      body: {
                          data: validation.formInstance,
                          errors: [
                              buildValidationError(validation.formInstance.email, 'email', {
                                  emailConfirmed: 'email is not confirmed',
                              }),
                          ],
                      },
                  };
        });
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
