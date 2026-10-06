import { useState, useEffect } from 'react';

import { Invoice } from './invoiceType.ts';
import InvoiceTable from './InvoiceTable.tsx';

export default function App() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getInvoices() {
            try {
                const response = await fetch('/api/invoices');

                if (!response.ok)
                    setError('Não foi possível carregar faturas.');
                
                const datas = await response.json();
                setInvoices(datas);
            } catch {
                setError('Não foi possível carregar faturas.');
            }

            setLoading(false);
        }
        getInvoices();
    }, []);

    if (loading) return <p>Carregando faturas...</p>;

    if (error) return <p>{error}</p>;

    return <InvoiceTable invoices={invoices} />
}
