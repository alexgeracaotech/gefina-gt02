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
  const tdStyle = 'p-3 border-b border-border';

  return (
    <tr>
      <td className={tdStyle}>{props.invoice.customer.name}</td>
      <td className={`${tdStyle} tabular-nums`}>
        {formatCurrency(props.invoice.amount)}
      </td>
      <td className={`${tdStyle} text-center tabular-nums`}>
        {formatDate(props.invoice.issueDate)}
      </td>
      <td className={`${tdStyle} text-center tabular-nums`}>
        {formatDate(props.invoice.dueDate)}
      </td>
      <td
        className={`${tdStyle} text-center ${situationClass(props.invoice.situation)}`}
      >
        {situationLabel(props.invoice.situation)}
      </td>
      <td className={`${tdStyle} px-0 text-center`}>
        <button
          className="px-4 py-2 border border-border rounded-control cursor-pointer hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-primary"
          type="button"
          onClick={() => props.edit(props.invoice)}
        >
          Alterar
        </button>
      </td>
    </tr>
  );
}
