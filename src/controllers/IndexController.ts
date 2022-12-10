import { Controller, Get, Response } from '@decorators/express';
import * as e from 'express';

@Controller('/')
export class IndexController {
    @Get('/')
    async health(@Response() res: e.Response) {
        res.status(200).json({
            up: true,
        });
    }
}
