import { Router } from 'express';

import findDashboard from './dashboard.service.ts';

const router = Router();

router.get('/', async (_request, response) => {
    try {
        const dashboard = await findDashboard();

        response.status(200).json(dashboard);
    } catch (error) {
        console.error(error);

        response.status(500).json({ error: { message: 'Não foi possível carregar o painel inicial.' } });
    }
});

export default router;
