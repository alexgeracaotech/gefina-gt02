import InvoiceRow from './InvoiceRow.tsx';
import type { Invoice } from './invoiceType.ts';

interface InvoiceTableProps {
  invoices: Invoice[];
  edit: (invoice: Invoice) => void;
}

export default function InvoiceTable(props: InvoiceTableProps) {
  const thStyle =
    'text-sm font-medium p-3 border-b border-border text-text-muted';

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className={`${thStyle} text-left`}>Cliente</th>
          <th className={`${thStyle} text-left`}>Valor</th>
          <th className={thStyle}>Data de Emissão</th>
          <th className={thStyle}>Data de Vencimento</th>
          <th className={thStyle}>Situação</th>
          <th className={thStyle}></th>
        </tr>
      </thead>
      <tbody>
        {props.invoices.map((invoice) => (
          <InvoiceRow
            key={invoice.id}
            invoice={invoice}
            edit={props.edit}
          />
        ))}
      </tbody>
    </table>
  );
}
