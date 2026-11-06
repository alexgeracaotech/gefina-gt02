import supertest from 'supertest';
import {
    describe,
    it,
    expect
} from 'vitest';

import app from './app.ts';

describe(
    'rotas de faturas',
    () => {
        it(
            'devolve a relação de faturas',
            async () => {
                const request = supertest(app);
                const response = await request.get('/api/invoices');

                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            }
        );
    }
);
