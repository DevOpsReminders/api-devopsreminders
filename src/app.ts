import { createServer } from '@server/index';

(async () => {
    createServer(baseUrl => {
        console.info(`Starting server on ${baseUrl}`);
    });
})().catch(console.error);
