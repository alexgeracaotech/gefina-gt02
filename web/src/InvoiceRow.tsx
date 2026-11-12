import type { Invoice } from './invoiceType.ts';
import {
  formatCurrency,
  formatDate,
  situationClass,
  situationLabel
} from './utils.ts';

interface InvoiceRowProps {
  invoice: Invoice;
  edit: (invoice: Invoice) => void;
}

export default function InvoiceRow(props: InvoiceRowProps) {
  const invoice = props.invoice;

  return (
    <tr>
      <td>{invoice.customer.name}</td>
      <td className="numeric">{formatCurrency(invoice.amount)}</td>
      <td className="numeric numeric-date">
        {formatDate(invoice.issueDate)}
      </td>
      <td className="numeric numeric-date">
        {formatDate(invoice.dueDate)}
      </td>
      <td className={situationClass(invoice.situation)}>
        {situationLabel(invoice.situation)}
      </td>
      <td className="td-button">
        <button
          className="button-secondary"
          type="button"
          onClick={() => props.edit(invoice)}
        >
          Alterar
        </button>
      </td>
    </tr>
  );
}
