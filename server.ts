import { createServer } from 'node:http';

import send from './send.ts';

createServer(function (request, response) {
    if (request.url !== '/api/health') {
        send(response, 404, { message: 'Recurso não encontrado.' });
        return;
    }
    
    send(response, 200, { status: 'ok' });
}).listen(3000);
