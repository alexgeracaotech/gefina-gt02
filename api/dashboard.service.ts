import type { InvoiceStatus } from './invoice.schema.ts';

import {
  findOverdueInvoices,
  findRecentInvoices,
  type Invoice
} from './invoice.service.ts';
import prisma from './prisma.ts';

interface Dashboard {
  totals: {
    paid: number;
    pending: number;
    invoiceCount: number;
    customerCount: number;
  };
  recentInvoices: Invoice[];
  overdueInvoices: Invoice[];
}

async function sumAmountByStatus(
  status: InvoiceStatus
): Promise<number> {
  const sum = await prisma.invoice.aggregate({
    where: { status },
    _sum: { amount: true }
  });

  return !sum._sum.amount ? 0 : sum._sum.amount;
}

export default async function findDashboard(): Promise<Dashboard> {
  const paid = await sumAmountByStatus('paid');
  const pending = await sumAmountByStatus('pending');
  const invoiceCount = await prisma.invoice.count();
  const customerCount = await prisma.customer.count();
  const recentInvoices = await findRecentInvoices();
  const overdueInvoices = await findOverdueInvoices();

  return {
    totals: {
      paid,
      pending,
      invoiceCount,
      customerCount
    },
    recentInvoices,
    overdueInvoices
  };
}
