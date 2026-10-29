import { useState, SubmitEvent } from 'react';

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
    const [amount, setAmount] = useState(!props.invoice ? '' : (props.invoice.amount / 100).toFixed(2));
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

    return <form onSubmit={handleSubmit}>
        <h2>{!props.invoice ? 'Criar fatura' : 'Editar fatura'}</h2>

        <div>
            <label htmlFor='customer'>Cliente</label>
            <select
                id='customer'
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                required
            >
                <option>Selecione um Cliente</option>
                {props.customers.map((customer) => {
                    return <option key={customer.id} value={customer.id}>
                        {customer.name} — {customer.email}
                    </option>;
                })}
            </select>
        </div>
        <div>
            <label htmlFor='amount'>Valor</label>
            <input
                id='amount'
                type='number'
                step='0.01'
                min='0.01'
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
            />
        </div>
        <div>
            <label htmlFor='status'>Situação</label>
            <select
                id='status'
                value={status}
                onChange={(event) => setStatus(event.target.value as InvoiceStatus)}
            >
                <option value='pending'>Pendente</option>
                <option value='paid'>Paga</option>
            </select>
        </div>
        <div>
            <label htmlFor='issueDate'>Emissão</label>
            <input
                id='issueDate'
                type='date'
                value={issueDate}
                onChange={(event) => setIssueDate(event.target.value)}
                required
            />
        </div>
        <div>
            <label htmlFor='dueDate'>Vencimento</label>
            <input
                id='dueDate'
                type='date'
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                required
            />
        </div>

        {!props.error ? null : <p>{props.error}</p>}

        <div>
            {!props.invoice ? null : <button
                type='button'
                onClick={props.onDelete}
                disabled={props.busy}
            >Excluir</button>}
            <button
                type='button'
                onClick={props.onCancel}
                disabled={props.busy}
            >Cancelar</button>
            <button
                type='submit'
                disabled={props.busy}
            >{props.busy ? 'Salvando...' : 'Salvar'}</button>
        </div>
    </form>;
}
