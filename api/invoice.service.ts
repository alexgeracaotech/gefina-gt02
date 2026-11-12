import type {
  Customer as CustomerRecord,
  Invoice as InvoiceRecord
} from '@prisma/client';
import type {
  InvoiceInput,
  InvoiceStatus
} from './invoice.schema.ts';
import prisma from './prisma.ts';

type InvoiceSituation = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: number;
  amount: number;
  status: InvoiceStatus;
  situation: InvoiceSituation;
  issueDate: string;
  dueDate: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
}

type InvoiceWithCustomer = InvoiceRecord & {
  customer: CustomerRecord;
};

function formatInvoice(record: InvoiceWithCustomer): Invoice {
  const situation: InvoiceSituation =
    record.status === 'paid'
      ? 'paid'
      : record.dueDate < new Date()
        ? 'overdue'
        : 'pending';

  return {
    id: record.id,
    amount: record.amount,
    status: record.status as InvoiceStatus,
    situation,
    issueDate: record.issueDate.toISOString().slice(0, 10),
    dueDate: record.dueDate.toISOString().slice(0, 10),
    customer: {
      id: record.customer.id,
      name: record.customer.name,
      email: record.customer.email
    }
  };
}

export async function findAllInvoices(): Promise<Invoice[]> {
  const records = await prisma.invoice.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' }
  });

  return records.map(formatInvoice);
}

export async function findInvoiceById(
  id: number
): Promise<Invoice | undefined> {
  const record = await prisma.invoice.findUnique({
    include: { customer: true },
    where: { id }
  });

  return !record ? undefined : formatInvoice(record);
}

export async function findRecentInvoices(): Promise<Invoice[]> {
  const records = await prisma.invoice.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return records.map(formatInvoice);
}

export async function findOverdueInvoices(): Promise<Invoice[]> {
  const records = await prisma.invoice.findMany({
    where: {
      status: 'pending',
      dueDate: { lt: new Date() }
    },
    include: { customer: true },
    orderBy: { dueDate: 'asc' },
    take: 5
  });

  return records.map(formatInvoice);
}

export async function insertInvoice(
  data: InvoiceInput
): Promise<Invoice> {
  const record = await prisma.invoice.create({
    data: {
      customerId: data.customerId,
      amount: data.amount,
      status: data.status,
      issueDate: new Date(data.issueDate),
      dueDate: new Date(data.dueDate)
    },
    include: { customer: true }
  });

  return formatInvoice(record);
}

export async function modifyInvoice(
  id: number,
  data: InvoiceInput
): Promise<Invoice | undefined> {
  const existing = await findInvoiceById(id);

  if (!existing) return;

  const record = await prisma.invoice.update({
    where: { id },
    data: {
      customerId: data.customerId,
      amount: data.amount,
      status: data.status,
      issueDate: new Date(data.issueDate),
      dueDate: new Date(data.dueDate)
    },
    include: { customer: true }
  });

  return formatInvoice(record);
}

export async function removeInvoice(
  id: number
): Promise<InvoiceRecord | undefined> {
  const existing = await findInvoiceById(id);

  if (!existing) return;

  return await prisma.invoice.delete({ where: { id } });
}
