import { useState, useEffect } from 'react';

import { Dashboard } from './dashboardType.ts';

import SummaryCard from './SummaryCard.tsx';
import InvoiceSummaryTable from './InvoiceSummaryTable.tsx';

import { formatCurrency } from './utils.ts';

export default function DashboardPage() {
    const [dashboard, setDashboard] = useState<null | Dashboard>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getDashboard() {
            try {
                const response = await fetch('/api/dashboard');

                if (!response.ok) {
                    setError('Não foi possível carregar o painel inicial.');
                    setLoading(false);
                    return
                }

                const datas = await response.json();
                setDashboard(datas);
            } catch (error) {
                console.error(error);

                setError('Não foi possível carregar o painel inicial.');
            }

            setLoading(false);
        }

        getDashboard();
    }, []);

    if (loading) return <p>Carregando painel incial...</p>

    if (error !== null || dashboard === null) return <p>{error}</p>

    return <div>
        <h1>Painel Inicial</h1>

        <div className='summary-cards'>
            <SummaryCard label='Total recebido: ' value={formatCurrency(dashboard.totals.paid)} />
            <SummaryCard label='Total pendente: ' value={formatCurrency(dashboard.totals.pending)} />
            <SummaryCard label='Faturas: ' value={String(dashboard.totals.invoiceCount)} />
            <SummaryCard label='Clientes: ' value={String(dashboard.totals.customerCount)} />
        </div>

        <div className='summary-tables'>
            <InvoiceSummaryTable
                title='Faturas Recentes'
                dateLabel='Emissão'
                invoices={dashboard.recentInvoices}
                date={(invoice) => invoice.issueDate}
            />
            <InvoiceSummaryTable
                title='Faturas Atrasadas'
                dateLabel='Vencimento'
                invoices={dashboard.overdueInvoices}
                date={(invoice) => invoice.dueDate}
            />
        </div>
    </div>;
}