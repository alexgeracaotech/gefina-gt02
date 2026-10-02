type InvoiceStatus = 'pending' | 'paid';

interface Customer {
  id: number;
  name: string;
  email: string;
}

interface Invoice {
  id: number;
  amount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  customer: Customer;
}

const invoices: Invoice[] = [
  {
    id: 1,
    amount: 125000,
    status: 'pending',
    issueDate: '2026-06-01',
    dueDate: '2026-06-15',
    customer: {
      id: 1,
      name: 'Construtora Meridiano',
      email: 'contato@meridiano.com.br',
    },
  },
  {
    id: 2,
    amount: 348000,
    status: 'paid',
    issueDate: '2026-05-12',
    dueDate: '2026-06-11',
    customer: {
      id: 1,
      name: 'Construtora Meridiano',
      email: 'contato@meridiano.com.br',
    },
  },
  {
    id: 3,
    amount: 96500,
    status: 'pending',
    issueDate: '2026-06-20',
    dueDate: '2026-07-20',
    customer: {
      id: 2,
      name: 'Gráfica Aurora',
      email: 'contato@graficaaurora.com.br',
    },
  },
];

export default invoices;
