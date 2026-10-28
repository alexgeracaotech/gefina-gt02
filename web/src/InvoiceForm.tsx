import { useState } from 'react';

import { Invoice, InvoiceInput, InvoiceStatus } from './invoiceType.ts';
import { CustomerOption } from './customerType.ts';

interface InvoiceFormProps {
    invoice: Invoice | null;
    customers: CustomerOption[];
    error: string | null;
    onDelete: () => void;
    onCancel: () => void;
    onSubmit: (values: InvoiceInput) => void;
    busy: boolean;
}

export default function InvoiceForm(props: InvoiceFormProps) {
    const [customerId, setCustomerId] = useState(!props.invoice ? '' : props.invoice.customer.id);
    const [amount, setAmount] = useState(!props.invoice ? '' : props.invoice.amount / 100);
    const [status, setStatus] = useState<InvoiceStatus>(!props.invoice ? 'pending' : props.invoice.status);
    const [issueDate, setIssueDate] = useState(!props.invoice ? '' : props.invoice.issueDate);
    const [dueDate, setDueDate] = useState(!props.invoice ? '' : props.invoice.dueDate);

    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();

        props.onSubmit({
            customerId: Number(customerId),
            amount: Math.round(Number(amount) * 100),
            status,
            issueDate,
            dueDate
        });
    }

    return <form>
        <div>
            <label htmlFor='customer'>Cliente</label>
            <select id='customer'></select>
        </div>
        <div>
            <label htmlFor='amount'>Valor</label>
            <input
                id='amount'
                type='number'
                step='0.01'
                min='0.01'
                required
            />
        </div>
        <div>
            <label htmlFor='status'>Situação</label>
            <select id='status'>
                <option>Pendente</option>
                <option>Paga</option>
            </select>
        </div>
        <div>
            <label htmlFor='issueDate'>Emissão</label>
            <input
                id='issueDate'
                type='date'
                required
            />
        </div>
        <div>
            <label htmlFor='dueDate'>Vencimento</label>
            <input
                id='dueDate'
                type='date'
                required
            />
        </div>
        <div>
            <button type='button'>Excluir</button>
            <button type='button'>Cancelar</button>
            <button type='submit'>Salvar</button>
        </div>
    </form>;
}
