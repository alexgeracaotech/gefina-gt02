import { createServer } from 'node:http';

createServer(function (request, response) {
    if (request.url !== '/api/health') {
        response.writeHead(404, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ message: 'Recurso não encontrado.' }));
        return;
    }
    
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok' }));
}).listen(3000);
