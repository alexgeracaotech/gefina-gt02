import InvoiceRow from './InvoiceRow.tsx';
import { Invoice } from './invoiceType.ts';

interface InvoiceTableProps {
    invoices: Invoice[];
}

export default function InvoiceTable(props: InvoiceTableProps) {
    const invoices = props.invoices;

    return <table>
        <thead>
            <tr>
                <th>Cliente</th>
                <th>Valor</th>
                <th className='numeric-date'>Data de Emissão</th>
                <th className='numeric-date'>Data de Vencimento</th>
                <th>Situação</th>
            </tr>
        </thead>
        <tbody>
            {invoices.map(invoice => (
                <InvoiceRow
                    key={invoice.id}
                    invoice={invoice}
                />
            ))}
        </tbody>
    </table>
} 