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
  try {
    const invoices = await findAllInvoices();
  
    response.status(200).json(invoices);
  } catch (error) {
    console.error(error);

    response.status(500).json({ error: {
      status: 500,
      message: 'Não foi possível encontrar faturas.'
    }})
  }
});

router.get('/:id', async (request, response) => {
  try {
    const id = Number(request.params.id);
  
    const invoice = await findInvoiceById(id);
  
    if (!invoice) response.status(404).json({ error: {
      status: 404,
      message: 'Fatura não encontrada.'
    }});
  
    response.status(200).json(invoice);
  } catch (error) {
    console.error(error);

    response.status(500).json({ error: {
      status: 500,
      message: 'Não foi possível encontrar fatura.'
    }});
  }
});

router.post('/', async (request, response) => {
  try {
    const invoice = await insertInvoice(request.body);

    if (!invoice) response.status(404).json({ error: {
      status: 404,
      message: 'Fatura não encontrada.'
    }});

    response.status(201).json(invoice);
  } catch (error) {
    console.error(error);

    response.status(500).json({ error: {
      status: 500,
      message: 'Não foi possível inserir fatura.'
    }});
  }
});

router.put('/:id', async (request, response) => {
  try {
    const invoice = await modifyInvoice(
      Number(request.params.id),
      request.body
    );

    if(!invoice) response.status(404).json({ error: {
      status: 404,
      message: 'Fatura não encontrada.'
    }});

    response.status(200).json(invoice);
  } catch (error) {
    console.error(error);

    response.status(500).json({ error: {
      status: 500,
      message: 'Não foi possível modificar fatura.'
    }});
  }
});

router.delete('/:id', async (request, response) => {
  try {
    const deleted = await removeInvoice(Number(request.params.id));
  
    if (!deleted) response.status(404).json({ error: {
      status: 404,
      message: 'Fatura não encontrada.'
    }});
  
    response.status(204).end();
  } catch (error) {
    console.error(error);

    response.status(500).json({ error: {
      status: 500,
      message: 'Não foi possível remover fatura.'
    }});
  }
})

export default router;
