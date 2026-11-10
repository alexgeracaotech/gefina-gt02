import {
    beforeEach,
    afterAll,
    describe,
    it,
    expect
} from 'vitest';
import supertest from 'supertest';

import app from './app.ts';

import prisma from './prisma.ts';

const user = {
    id: 0,
    email: 'usuario@teste.com.br'
};
const customer = {
    id: 0,
    email: 'cliente@teste.com.br'
};
const invoice = { id: 0 };

async function populate(): Promise<void> {
    await prisma.user.create({
        data: {
            name: 'Usuário de Teste',
            email: user.email,
            passwordHash: 'placeholder'
        }
    }).then(data => user.id = data.id);

    await prisma.customer.create({
        data: {
            userId: user.id,
            name: 'Cliente de Teste',
            email: customer.email
        }
    }).then(data => customer.id = data.id);

    await prisma.invoice.create({
        data: {
            customerId: customer.id,
            amount: 125037,
            status: 'pending',
            issueDate: new Date('2026-10-01'),
            dueDate: new Date('2026-10-31')
        }
    }).then(data => invoice.id = data.id);
}

async function clear(): Promise<void> {
    await prisma.invoice.deleteMany({ where: { customerId: customer.id } });
    await prisma.customer.deleteMany({ where: { userId: user.id } });
    await prisma.user.deleteMany({ where: { id: user.id } });
}

const request = supertest(app);

describe(
    'rotas de fatura',
    () => {
        beforeEach(async () => {
            await clear();
            await populate();
        });

        afterAll(async () => {
            await clear();
            await prisma.$disconnect();
        });

        it(
            'devolve a relação de faturas',
            async () => {
                const response = await request.get('/api/invoices');

                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            }
        );

        it(
            'cria fatura e devolve o registro criado',
            async () => {
                const response = await request
                    .post('/api/invoices')
                    .send({
                        customerId: customer.id,
                        amount: 55555,
                        status: 'pending',
                        issueDate: '2026-10-01',
                        dueDate: '2026-10-31'
                    });

                    expect(response.status).toBe(201);
                    expect(response.body.situation).toBe('overdue');
            }
        );

        it(
            'altera fatura e devolve registro alterado',
            async () => {
                const response = await request
                    .put(`/api/invoices/${invoice.id}`)
                    .send({
                        customerId: customer.id,
                        amount: 125037,
                        status: 'paid',
                        issueDate: '2026-10-01',
                        dueDate: '2026-10-31'
                    });

                    expect(response.status).toBe(200);
                    expect(response.body.situation).toBe('paid');
            }
        );

        it(
            'remove fatura',
            async () => {
                const removal = await request.delete(`/api/invoices/${invoice.id}`);
                const search = await request.get(`/api/invoices/${invoice.id}`);

                expect(removal.status).toBe(204);
                expect(search.status).toBe(404);
            }
        );

        it(
            'recusa busca de fatura com identificador inválido',
            async () => {
                const response = await request.get('/api/invoices/abc');

                expect(response.status).toBe(400);
            }
        );

        it(
            'recusa criar fatura com valor zerado',
            async () => {
                const response = await request
                    .post('/api/invoices')
                    .send({
                        customerId: customer.id,
                        amount: 0,
                        status: 'pending',
                        issueDate: '2026-10-01',
                        dueDate: '2026-10-31'
                    });

                    expect(response.status).toBe(400);
                    expect(response.body.error.fields.amount).toBeDefined();
            }
        );
    }
);
