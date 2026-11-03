import { Invoice, InvoiceInput } from './invoiceType.ts';

const header = { 'content-type': 'application/json' };

export async function getAllInvoices(): Promise<Invoice[]> {
    const response = await fetch('/api/invoices');

    if (!response.ok) throw new Error('Falha ao buscar faturas.');

    return response.json();
}

export async function getInvoiceById(id: number): Promise<Invoice> {
    const response = await fetch(`/api/invoices/${id}`);

    if (!response.ok) throw new Error('Falha ao buscar fatura.');

    return response.json();
}

export async function createInvoice(datas: InvoiceInput): Promise<void> {
    const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: header,
        body: JSON.stringify(datas)
    });

    if (!response.ok) throw new Error('Falha ao criar fatura.');
}

export async function updateInvoice(id: number, datas: InvoiceInput): Promise<void> {
    const response = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: header,
        body: JSON.stringify(datas)
    });

    if (!response.ok) throw new Error('Falha ao editar fatura.');
}

export async function deleteInvoice(id: number): Promise<void> {
    const response = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });

    if (!response.ok) throw new Error('Falha ao excluir fatura.');
}
