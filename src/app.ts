import { createServer } from '@server/index';
import {dbConnect} from "@database/connect";

(async () => {
    await dbConnect();

    createServer(baseUrl => {
        console.info(`Starting server on ${baseUrl}`);
    });
})().catch(console.error);
