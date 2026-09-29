import { Router } from 'express';

import invoices from './invoice.data.ts';

const router = Router();

router.get('/', function (request, response) {
    response.status(200).json(invoices);
});

router.get('/:id', function (request, response) {
    const id = +request.params.id;

    for (let i = 0; i < invoices.length; i++) {
        if (invoices[i].id === id) {
            response.status(200).json(invoices[i]);
            return;
        }
    }

    response.status(404).json({ error: { message: 'Fatura não encontrada.' } });
});

export default router;
