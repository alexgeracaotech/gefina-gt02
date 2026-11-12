import type { Prisma } from '@prisma/client';

import prisma from '../prisma.ts';

type UserRole = 'admin' | 'user';

type InvoiceStatus = 'paid' | 'pending';

type IdByEmail = Map<string, number>;

interface SeedCustomer {
  name: string;
  invoiceCount: number;
}

interface SeedUser {
  name: string;
  email: string;
  role: UserRole;
  customers: SeedCustomer[];
}

interface PreparedCustomer extends SeedCustomer {
  ownerEmail: string;
  email: string;
  imageUrl: string | null;
}

interface DayRange {
  minimum: number;
  maximum: number;
}

interface InvoiceProfile {
  status: InvoiceStatus;
  issuedDaysAgo: DayRange;
  paymentTermDays: DayRange;
}

const PLACEHOLDER_PASSWORD_HASH = 'provisorio';

const SEED_USERS: SeedUser[] = [
  {
    name: 'Usuário Administrador',
    email: 'admin@gefina.com.br',
    role: 'admin',
    customers: []
  },
  {
    name: 'Ana Bessa',
    email: 'ana@gefina.com.br',
    role: 'user',
    customers: [
      { name: 'Alvorada Engenharia', invoiceCount: 15 },
      { name: 'Bramante Alimentos', invoiceCount: 14 },
      { name: 'Construtora Meridiano', invoiceCount: 13 },
      { name: 'Dalva Confecções', invoiceCount: 12 },
      { name: 'Editora Pirâmide', invoiceCount: 11 },
      { name: 'Ferragens Atlântico', invoiceCount: 10 },
      { name: 'Gráfica Boreal', invoiceCount: 9 },
      { name: 'Hidrotec Instalações', invoiceCount: 8 }
    ]
  },
  {
    name: 'Carlos Daniel',
    email: 'carlos@gefina.com.br',
    role: 'user',
    customers: [
      { name: 'Imobiliária Ipanema', invoiceCount: 7 },
      { name: 'Jardins Paisagismo', invoiceCount: 6 },
      { name: 'Kalamazoo Importadora', invoiceCount: 5 },
      { name: 'Laticínios Serrano', invoiceCount: 4 },
      { name: 'Marcenaria Tapajós', invoiceCount: 3 },
      { name: 'Nébula Software', invoiceCount: 2 },
      { name: 'Ótica Girassol', invoiceCount: 1 }
    ]
  },
  {
    name: 'Eder Fagundes',
    email: 'eder@gefina.com.br',
    role: 'user',
    customers: [
      { name: 'Papelaria Quadrante', invoiceCount: 0 },
      { name: 'Química Delta', invoiceCount: 0 },
      { name: 'Refrigeração Polar', invoiceCount: 12 },
      { name: 'Serralheria Vulcano', invoiceCount: 11 },
      { name: 'Transportes Guanabara', invoiceCount: 10 },
      { name: 'Uniformes Cardinal', invoiceCount: 9 }
    ]
  },
  {
    name: 'Gustavo Hebe',
    email: 'gustavo@gefina.com.br',
    role: 'user',
    customers: [
      { name: 'Vidraçaria Horizonte', invoiceCount: 8 },
      { name: 'Xarope Botânico', invoiceCount: 7 },
      { name: 'Zênite Consultoria', invoiceCount: 3 }
    ]
  }
];

const INVOICE_AMOUNTS: number[] = [
  5_000, 89_000, 245_000, 480_000, 760_000, 1_120_000, 1_480_000,
  1_850_000, 2_240_000, 2_680_000, 3_150_000, 3_920_000, 4_850_000,
  6_300_000, 7_950_000
];

const PAID_INVOICE: InvoiceProfile = {
  status: 'paid',
  issuedDaysAgo: { minimum: 60, maximum: 359 },
  paymentTermDays: { minimum: 15, maximum: 60 }
};

const PENDING_INVOICE: InvoiceProfile = {
  status: 'pending',
  issuedDaysAgo: { minimum: 10, maximum: 29 },
  paymentTermDays: { minimum: 45, maximum: 60 }
};

const OVERDUE_INVOICE: InvoiceProfile = {
  status: 'pending',
  issuedDaysAgo: { minimum: 120, maximum: 319 },
  paymentTermDays: { minimum: 15, maximum: 60 }
};

const INVOICE_PROFILE_ROTATION: InvoiceProfile[] = [
  ...Array<InvoiceProfile>(9).fill(PAID_INVOICE),
  ...Array<InvoiceProfile>(7).fill(PENDING_INVOICE),
  ...Array<InvoiceProfile>(4).fill(OVERDUE_INVOICE)
];

const REGISTRATION_DELAY_DAYS: DayRange = { minimum: 0, maximum: 2 };

const SEED_CUSTOMERS: PreparedCustomer[] =
  prepareCustomers(SEED_USERS);

const TODAY: Date = getStartOfTodayInUtc();

function getStartOfTodayInUtc(): Date {
  const today = new Date();

  today.setUTCHours(0, 0, 0, 0);

  return today;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);

  result.setUTCDate(result.getUTCDate() + days);

  return result;
}

function pickByRotation<Item>(
  items: readonly Item[],
  index: number
): Item {
  return items[index % items.length];
}

function pickDaysByRotation(range: DayRange, index: number): number {
  const rangeLength = range.maximum - range.minimum + 1;

  return range.minimum + (index % rangeLength);
}

function prepareCustomers(users: SeedUser[]): PreparedCustomer[] {
  const customersWithOwner = users.flatMap((user) =>
    user.customers.map((customer) => ({
      ...customer,
      ownerEmail: user.email
    }))
  );

  return customersWithOwner.map((customer, index) => {
    const customerNumber = index + 1;
    const hasPhoto = index % 3 === 0;

    return {
      ...customer,
      email: `cliente${customerNumber}@exemplo.com.br`,
      imageUrl: hasPhoto
        ? `https://i.pravatar.cc/80?img=${customerNumber}`
        : null
    };
  });
}

function mapIdsByEmail(
  records: { id: number; email: string }[]
): IdByEmail {
  return new Map(records.map((record) => [record.email, record.id]));
}

function getRequiredId(idByEmail: IdByEmail, email: string): number {
  const id = idByEmail.get(email);

  if (id === undefined) {
    throw new Error(`Nenhum registro criado com o e-mail ${email}.`);
  }

  return id;
}

function buildInvoice(
  customerId: number,
  invoiceIndex: number
): Prisma.InvoiceCreateManyInput {
  const profile = pickByRotation(
    INVOICE_PROFILE_ROTATION,
    invoiceIndex
  );
  const daysSinceIssue = pickDaysByRotation(
    profile.issuedDaysAgo,
    invoiceIndex
  );
  const paymentTermDays = pickDaysByRotation(
    profile.paymentTermDays,
    invoiceIndex
  );
  const registrationDelayDays = pickDaysByRotation(
    REGISTRATION_DELAY_DAYS,
    invoiceIndex
  );
  const issueDate = addDays(TODAY, -daysSinceIssue);

  return {
    customerId,
    amount: pickByRotation(INVOICE_AMOUNTS, invoiceIndex),
    status: profile.status,
    issueDate,
    dueDate: addDays(issueDate, paymentTermDays),
    createdAt: addDays(issueDate, registrationDelayDays)
  };
}

async function resetTables(
  transaction: Prisma.TransactionClient
): Promise<void> {
  await transaction.$executeRaw`TRUNCATE users, sessions, customers, invoices RESTART IDENTITY`;
}

async function createUsers(
  transaction: Prisma.TransactionClient
): Promise<IdByEmail> {
  const users: Prisma.UserCreateManyInput[] = SEED_USERS.map(
    (user) => ({
      name: user.name,
      email: user.email,
      role: user.role,
      passwordHash: PLACEHOLDER_PASSWORD_HASH
    })
  );

  const createdUsers = await transaction.user.createManyAndReturn({
    data: users,
    select: { id: true, email: true }
  });

  return mapIdsByEmail(createdUsers);
}

async function createCustomers(
  transaction: Prisma.TransactionClient,
  userIdByEmail: IdByEmail
): Promise<IdByEmail> {
  const customers: Prisma.CustomerCreateManyInput[] =
    SEED_CUSTOMERS.map((customer) => ({
      userId: getRequiredId(userIdByEmail, customer.ownerEmail),
      name: customer.name,
      email: customer.email,
      imageUrl: customer.imageUrl
    }));

  const createdCustomers =
    await transaction.customer.createManyAndReturn({
      data: customers,
      select: { id: true, email: true }
    });

  return mapIdsByEmail(createdCustomers);
}

async function createInvoices(
  transaction: Prisma.TransactionClient,
  customerIdByEmail: IdByEmail
): Promise<number> {
  const invoices: Prisma.InvoiceCreateManyInput[] = [];

  for (const customer of SEED_CUSTOMERS) {
    const customerId = getRequiredId(
      customerIdByEmail,
      customer.email
    );

    for (
      let created = 0;
      created < customer.invoiceCount;
      created++
    ) {
      invoices.push(buildInvoice(customerId, invoices.length));
    }
  }

  const result = await transaction.invoice.createMany({
    data: invoices
  });

  return result.count;
}

async function seedDatabase(): Promise<void> {
  const invoiceCount = await prisma.$transaction(
    async (
      transaction: Prisma.TransactionClient
    ): Promise<number> => {
      await resetTables(transaction);

      const userIdByEmail = await createUsers(transaction);
      const customerIdByEmail = await createCustomers(
        transaction,
        userIdByEmail
      );

      return createInvoices(transaction, customerIdByEmail);
    }
  );

  console.log(`
        Dados repostos:

        ${SEED_USERS.length} usuários
        ${SEED_CUSTOMERS.length} clientes
        ${invoiceCount} faturas
    `);
}

try {
  await seedDatabase();
} finally {
  await prisma.$disconnect();
}
