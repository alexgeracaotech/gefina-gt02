import { Invoice } from './invoiceType.ts';

import {
    formatCurrency,
    formatDate
} from './utils.ts';

interface InvoiceSummaryTableProps {
    title: string;
    dateLabel: string;
    invoices: Invoice[];
    date: (invoice: Invoice) => string;
}

export default function InvoiceSummaryTable(props: InvoiceSummaryTableProps) {
    return <div>
        <h2>{props.title}</h2>

        <table>
            <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Valor</th>
                    <th>{props.dateLabel}</th>
                </tr>
            </thead>
            <tbody>
                {props.invoices.map((invoice) => {
                    return <tr key={invoice.id}>
                        <td>{invoice.customer.name}</td>
                        <td className='numeric'>{formatCurrency(invoice.amount)}</td>
                        <td className='numeric'>{formatDate(props.date(invoice))}</td>
                    </tr>;
                })}
            </tbody>
        </table>
    </div>;
}