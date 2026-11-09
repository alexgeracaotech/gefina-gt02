import supertest from 'supertest';
import {
    describe,
    it,
    expect,
    beforeEach,
    afterAll
} from 'vitest';

import app from './app.ts';

import pool from './database.ts';

const customer = {
    id: 0,
    email: 'teste@gefina.com.br'
}

const invoice = { id: 0 }

async function clear(): Promise<void> {
    await pool.query(
        `
            DELETE FROM invoices
            WHERE customer_id IN (
                SELECT id FROM customers
                WHERE email = $1
            );
        `,
        [customer.email]
    );

    await pool.query(
        `
            DELETE FROM customers
            WHERE email = $1;
        `,
        [customer.email]
    );
}

async function populate(): Promise<void> {
    const connectCustomer = await pool.query(
        `
            INSERT INTO customers (user_id, name, email)
            VALUES ((
                SELECT id FROM users
                ORDER BY id
                LIMIT 1
            ), 'Teste', $1)
            RETURNING id;
        `,
        [customer.email]
    );

    customer.id = connectCustomer.rows[0].id;

    const connectInvoice = await pool.query(
        `
            INSERT INTO invoices (customer_id, amount, status, issue_date, due_date)
            VALUES ($1, 125037, 'pending', '2026-10-01', '2026-10-31')
            RETURNING id;
        `,
        [customer.id]
    );

    invoice.id = connectInvoice.rows[0].id;
}

const request = supertest(app);

describe(
    'rotas de faturas',
    () => {
        beforeEach(async () => {
            await clear();
            await populate();
        });

        afterAll(async () => {
            await clear();
            await pool.end();
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
            'cria fatura e devolve o regitro criado',
            async () => {
                const response = await request
                    .post('/api/invoices')
                    .send({
                        customerId: customer.id,
                        amount: 12345,
                        status: 'pending',
                        issueDate: '2026-10-01',
                        dueDate: '2026-10-31'
                    });

                expect(response.status).toBe(201);
                expect(response.body.id).toBeDefined();
                expect(response.body.customer.id).toBe(customer.id);
                expect(response.body.situation).toBe('overdue');
            }
        );

        it(
            'altera fatura e devolve fatura alterada',
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
            'recusa criação de fatura com valor zerado',
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
