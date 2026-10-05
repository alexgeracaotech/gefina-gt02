import { Invoice } from './invoiceType.ts';
import statusLabel from './statusLabel.ts';

interface InvoiceRowProps {
    invoice: Invoice;
}

export default function InvoiceRow(props: InvoiceRowProps) {
    const invoice = props.invoice;

    return <tr>
        <td>{invoice.customer.name}</td>
        <td>{invoice.amount}</td>
        <td>{invoice.issueDate}</td>
        <td>{invoice.dueDate}</td>
        <td>{statusLabel(invoice.status)}</td>
    </tr>
}
