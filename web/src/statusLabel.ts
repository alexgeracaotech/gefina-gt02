import { InvoiceStatus } from './invoiceType.ts';

export default function statusLabel(status: InvoiceStatus) {
    return status === 'paid' ? 'Pago' : 'Pendente';
}
