import pool from './database.ts';

export type InvoiceStatus = 'paid' | 'pending';
type InvoiceSituation = 'paid' | 'pending' | 'overdue';

interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface Invoice {
  id: number;
  amount: number;
  status: InvoiceStatus;
  situation: InvoiceSituation;
  issueDate: string;
  dueDate: string;
  customer: Customer;
}

interface InvoiceRow {
  id: number;
  amount: number;
  status: InvoiceStatus;
  situation: InvoiceSituation;
  issue_date: string;
  due_date: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
}

function toInvoice(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    amount: row.amount,
    status: row.status,
    situation: row.situation,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    customer: {
      id: row.customer_id,
      name: row.customer_name,
      email: row.customer_email
    }
  };
}

function toInvoices(rows: InvoiceRow[]): Invoice[] {
  const invoices: Invoice[] = [];

  rows.forEach(invoice => invoices.push(toInvoice(invoice)));

  return invoices;
}

const baseQuery = `
  SELECT
    invoices.id,
    invoices.amount,
    invoices.status,
    CASE
      WHEN invoices.status = 'paid' THEN 'paid'
      WHEN invoices.due_date < CURRENT_DATE THEN 'overdue'
      ELSE 'pending'
    END AS situation,
    invoices.issue_date::text,
    invoices.due_date::text,
    customers.id AS customer_id,
    customers.name AS customer_name,
    customers.email AS customer_email
  FROM invoices
  JOIN customers
  ON customers.id = invoices.customer_id
`;

export async function findAllInvoices(): Promise<Invoice[]> {
  const connect = await pool.query<InvoiceRow>(`
    ${baseQuery}
    ORDER BY invoices.created_at DESC;
  `);

  return toInvoices(connect.rows);
}

export async function findInvoiceById(id: number): Promise<Invoice | undefined> {
  const connect = await pool.query<InvoiceRow>(`${baseQuery} WHERE invoices.id = $1;`, [id]);

  if (!connect.rows.length) return undefined;

  return toInvoice(connect.rows[0]);
}

export async function findRecentInvoices(): Promise<Invoice[]> {
  const connect = await pool.query<InvoiceRow>(`
    ${baseQuery}
    ORDER BY invoices.created_at DESC
    LIMIT 5;
  `);

  return toInvoices(connect.rows);
}

export async function findOverdueInvoices(): Promise<Invoice[]> {
  const connect = await pool.query<InvoiceRow>(`
    ${baseQuery}
    WHERE invoices.status = 'pending' AND invoices.due_date < CURRENT_DATE
    ORDER BY invoices.issue_date
    LIMIT 5;
  `);

  return toInvoices(connect.rows);
}
