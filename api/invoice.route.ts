import { Router } from 'express';

import {
  findAllInvoices,
  findInvoiceById,
  insertInvoice,
  modifyInvoice,
  removeInvoice
} from './invoice.service.ts';

const router = Router();

router.get('/', async (_request, response) => {
  const invoices = await findAllInvoices();

  response.status(200).json(invoices);
});

router.get('/:id', async (request, response) => {
  const id = Number(request.params.id);

  const invoice = await findInvoiceById(id);

  if (!invoice) response.status(404).json({
    error: {
      status: 404,
      message: 'Fatura não encontrada.'
    }
  });

  response.status(200).json(invoice);
});

router.post('/', async (request, response) => {
  const invoice = await insertInvoice(request.body);

  if (!invoice) response.status(404).json({
    error: {
      status: 404,
      message: 'Fatura não encontrada.'
    }
  });

  response.status(201).json(invoice);
});

router.put('/:id', async (request, response) => {
  const invoice = await modifyInvoice(
    Number(request.params.id),
    request.body
  );

  if (!invoice) response.status(404).json({
    error: {
      status: 404,
      message: 'Fatura não encontrada.'
    }
  });

  response.status(200).json(invoice);
});

router.delete('/:id', async (request, response) => {
  const deleted = await removeInvoice(Number(request.params.id));

  if (!deleted) response.status(404).json({
    error: {
      status: 404,
      message: 'Fatura não encontrada.'
    }
  });

  response.status(204).end();
})

export default router;
