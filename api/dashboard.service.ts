import pool from './database.ts';

import {
    type Invoice,
    type InvoiceStatus,
    findRecentInvoices,
    findOverdueInvoices
} from './invoice.service.ts';

interface DashboardTotals {
    paid: number;
    pending: number;
    invoiceCount: number;
    customerCount: number;
}

interface Dashboard {
    totals: DashboardTotals;
    recentInvoices: Invoice[];
    overdueInvoices: Invoice[];
}

async function sumAmountByStatus(status: InvoiceStatus): Promise<number> {
    const connect = await pool.query(
        'SELECT COALESCE(SUM(amount), 0)::int AS total FROM invoices WHERE status = $1',
        [status]
    );

    return connect.rows[0].total;
}

type Resource = 'invoices' | 'customers';

async function count(resource: Resource): Promise<number> {
    const connect = await pool.query(`SELECT COUNT(*)::int AS total FROM ${resource};`);

    return connect.rows[0].total;
}

export default async function findDashboard(): Promise<Dashboard> {
    const paid = await sumAmountByStatus('paid');
    const pending = await sumAmountByStatus('pending');
    const invoiceCount = await count('invoices');
    const customerCount = await count('customers');
    const recentInvoices = await findRecentInvoices();
    const overdueInvoices = await findOverdueInvoices();

    return {
        totals: {
            paid,
            pending,
            invoiceCount,
            customerCount
        },
        recentInvoices,
        overdueInvoices
    };
}
