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
                <td>Cliente</td>
                <td>Valor</td>
                <td>Data de Emissão</td>
                <td>Data de Vencimento</td>
                <td>Situação</td>
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