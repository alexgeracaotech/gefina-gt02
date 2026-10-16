import { Invoice } from './invoiceType.ts';
import {
    situationLabel,
    formatCurrency,
    formatDate
} from './utils.ts';

interface InvoiceRowProps {
    invoice: Invoice;
}

export default function InvoiceRow(props: InvoiceRowProps) {
    const invoice = props.invoice;

    return <tr>
        <td>{invoice.customer.name}</td>
        <td>{formatCurrency(invoice.amount)}</td>
        <td>{formatDate(invoice.issueDate)}</td>
        <td>{formatDate(invoice.dueDate)}</td>
        <td>{situationLabel(invoice.situation)}</td>
    </tr>
}
