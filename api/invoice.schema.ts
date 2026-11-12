import { type ZodError, z } from 'zod';

const invoiceStatusSchema = z.enum(
  ['paid', 'pending'],
  'A situação informada é inválida. Os valores permitidos são "Paga" e "Pendente".'
);

export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;

export const invoiceSchema = z
  .object({
    customerId: z
      .number('O cliente é obrigatório.')
      .refine((id) => !Number.isNaN(id), {
        message: 'O cliente é obrigatório.'
      })
      .int('O identificador do cliente deve ser um número inteiro.')
      .positive(
        'O identificador do cliente deve ser maior que zero.'
      ),
    amount: z
      .number('O valor é obrigatório.')
      .int('O valor da fatura deve ser um número inteiro.')
      .positive('O valor da fatura deve ser maior que zero.'),
    status: invoiceStatusSchema,
    issueDate: z.iso.date(
      'A data de emissão deve ser uma data válida.'
    ),
    dueDate: z.iso.date(
      'A data de vencimento deve ser uma data válida.'
    )
  })
  .refine((datas) => datas.dueDate >= datas.issueDate, {
    error:
      'A data de vencimento não pode ser anterior a data de emissão.',
    path: ['dueDate']
  });

export type InvoiceInput = z.infer<typeof invoiceSchema>;

interface InvoiceFieldErrors {
  customerId?: string;
  amount?: string;
  status?: string;
  issueDate?: string;
  dueDate?: string;
}

function firstError(
  messages: string[] | undefined
): string | undefined {
  console.log(messages);
  return !messages ? undefined : messages[0];
}

export function toFieldErrors(
  error: ZodError<InvoiceInput>
): InvoiceFieldErrors {
  const { fieldErrors } = z.flattenError(error);

  return {
    customerId: firstError(fieldErrors.customerId),
    amount: firstError(fieldErrors.amount),
    status: firstError(fieldErrors.status),
    issueDate: firstError(fieldErrors.issueDate),
    dueDate: firstError(fieldErrors.dueDate)
  };
}
