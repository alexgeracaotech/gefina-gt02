import { Invoice } from './invoiceType.ts';
import {
    situationLabel,
    situationClass,
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
        <td className='numeric'>{formatCurrency(invoice.amount)}</td>
        <td className='numeric numeric-date'>{formatDate(invoice.issueDate)}</td>
        <td className='numeric numeric-date'>{formatDate(invoice.dueDate)}</td>
        <td className={situationClass(invoice.situation)}>{situationLabel(invoice.situation)}</td>
    </tr>
}
