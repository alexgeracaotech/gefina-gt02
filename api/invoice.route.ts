import { Router } from 'express';

import {
  findAllInvoices,
  findInvoiceById
} from './invoice.service.ts';

const router = Router();

router.get('/', async (_request, response) => {
  const invoices = await findAllInvoices();

  response.status(200).json(invoices);
});

router.get('/:id', async (request, response) => {
  const id = Number(request.params.id);

  const invoice = await findInvoiceById(id);

  if (!invoice) response.status(404).json({ error: {
    status: 404,
    message: 'Fatura não encontrada.'
  }});

  response.status(200).json(invoice);
});

export default router;
