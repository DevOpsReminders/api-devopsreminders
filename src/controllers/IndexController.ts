import { Controller, Get, Response } from '@decorators/express';
import * as e from 'express';
import { UserEntity } from '@entities/UserEntity';

@Controller('/')
export class IndexController {
    @Get('/')
    async health(@Response() res: e.Response) {
        res.status(200).json({
            up: true,
        });
    }

    @Get('/users')
    async users(@Response() res: e.Response) {
        const users = await UserEntity.findAndCount();
        res.json(users);
    }
}
