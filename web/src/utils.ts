import { InvoiceSituation } from './invoiceType.ts';

export function situationLabel(situation: InvoiceSituation) {
    switch (situation) {
        case 'paid': return 'Paga';
        case 'pending': return 'Pendente';
        case 'overdue': return 'Atrasada';
    }
}

export function situationClass(situation: InvoiceSituation) {
    switch (situation) {
        case 'paid': return 'situation-paid';
        case 'pending': return 'situation-pending';
        case 'overdue': return 'situation-overdue';
    }
}

export function formatCurrency(cents: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return formatter.format(cents / 100);
}

export function formatDate(isoDate: string): string {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return formatter.format(new Date(`${isoDate}T00:00:00`));
}
