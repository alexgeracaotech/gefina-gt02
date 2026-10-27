import type { ErrorRequestHandler } from 'express';

const handleError: ErrorRequestHandler = (error, _request, response, _next) => {
    console.error(error);

    response.status(500).json({
        error: {
            status: 500,
            message: 'Não foi possível concluir operação.'
        }
    });
};

export default handleError;
