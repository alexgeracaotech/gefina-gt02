import { Router } from 'express';

import findDashboard from './dashboard.service.ts';

const router = Router();

router.get('/', async (_request, response) => {
    const dashboard = await findDashboard();

    response.status(200).json(dashboard);
});

export default router;
