import { useState, SubmitEvent, SetStateAction } from 'react';

import {
    Invoice,
    InvoiceInput,
    InvoiceStatus,
    InvoiceFieldErrors
} from './invoiceType.ts';
import { CustomerOption } from './customerType.ts';

interface InvoiceFormProps {
    invoice: Invoice | null;
    customers: CustomerOption[];
    error: string | null;
    fieldErrors: InvoiceFieldErrors;
    confirmDelete: boolean;
    setConfirmDelete: React.Dispatch<SetStateAction<boolean>>;
    confirm: () => void;
    onDelete: () => void;
    onCancel: () => void;
    onSubmit: (values: InvoiceInput) => void;
    busy: boolean;
}

export default function InvoiceForm(props: InvoiceFormProps) {
    const [customerId, setCustomerId] = useState(!props.invoice ? undefined : String(props.invoice.customer.id));
    const [amount, setAmount] = useState(!props.invoice ? '' : (props.invoice.amount / 100).toFixed(2));
    const [status, setStatus] = useState<InvoiceStatus>(!props.invoice ? 'pending' : props.invoice.status);
    const [issueDate, setIssueDate] = useState(!props.invoice ? '' : props.invoice.issueDate);
    const [dueDate, setDueDate] = useState(!props.invoice ? '' : props.invoice.dueDate);

    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        props.setConfirmDelete(false);

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

        <div className='field'>
            <label htmlFor='customer'>Cliente</label>
            <select
                id='customer'
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                required
            >
                <option value=''>Selecione um cliente</option>
                {props.customers.map((customer) => {
                    return <option key={customer.id} value={customer.id}>
                        {customer.name} — {customer.email}
                    </option>;
                })}
            </select>
        </div>
        <div className='field'>
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
        <div className='horizontal-fields'>
            <div className='field'>
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
            <div className='field'>
                <label htmlFor='issueDate'>Emissão</label>
                <input
                    id='issueDate'
                    type='date'
                    value={issueDate}
                    onChange={(event) => setIssueDate(event.target.value)}
                    required
                />
            </div>
            <div className='field'>
                <label htmlFor='dueDate'>Vencimento</label>
                <input
                    id='dueDate'
                    type='date'
                    min={issueDate}
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    required
                />
            </div>
        </div>

        <div className='form-actions'>
            {!props.invoice ? null : <button
                className='button-danger'
                type='button'
                onClick={props.onDelete}
                disabled={props.busy}
            >{props.busy && props.confirmDelete? 'Excluindo...' : 'Excluir'}</button>}
            <button
                className='button-secondary'
                type='button'
                onClick={props.onCancel}
                disabled={props.busy}
            >Cancelar</button>
            <button
                className='button-primary'
                type='submit'
                disabled={props.busy}
            >{props.busy && !props.confirmDelete ? 'Salvando...' : 'Salvar'}</button>
        </div>

        {props.confirmDelete && <div className='confirm-form'>
            <p>A exclusão é definitiva e não pode ser desfeita. Deseja prosseguir?</p>
            <button
                className='button-secondary'
                type='button'
                onClick={() => props.setConfirmDelete(false)}
                disabled={props.busy}
            >Não</button>
            <button
                className='button-danger'
                type='button'
                onClick={props.confirm}
                disabled={props.busy}
            >Sim</button>
        </div>}
        
        {props.fieldErrors.customerId && <p className='form-error'>{props.fieldErrors.customerId}</p>}
        {props.fieldErrors.amount && <p className='form-error'>{props.fieldErrors.amount}</p>}
        {props.fieldErrors.status && <p className='form-error'>{props.fieldErrors.status}</p>}
        {props.fieldErrors.issueDate && <p className='form-error'>{props.fieldErrors.issueDate}</p>}
        {props.fieldErrors.dueDate && <p className='form-error'>{props.fieldErrors.dueDate}</p>}
        {props.error && <p className='form-error'>{props.error}</p>}
    </form>;
}
