import { Invoice } from './invoiceType.ts';
import situationLabel from './situationLabel.ts';

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
        <td>{situationLabel(invoice.situation)}</td>
    </tr>
}
