import {
    describe,
    it,
    expect,
    vi
} from 'vitest';

import {
    render,
    screen
} from '@testing-library/react';

import InvoiceForm from './InvoiceForm.tsx';

import user from '@testing-library/user-event';

describe(
    'InvoiceForm',
    () => {
        it(
            'apresenta os campos com rótulo associado',
            () => {
                render(<InvoiceForm
                    invoice={null}
                    customers={[{
                        id: 1,
                        name: 'Cliente de Teste',
                        email: 'cliente@teste.com.br'
                    }]}
                    error={null}
                    fieldErrors={{}}
                    onDelete={() => {}}
                    confirmDelete={false}
                    setConfirmDelete={() => {}}
                    confirm={() => {}}
                    onCancel={() => {}}
                    onSubmit={() => {}}
                    busy={false}
                />);

                expect(screen.getByLabelText('Cliente')).toBeDefined();
                expect(screen.getByLabelText('Valor')).toBeDefined();
                expect(screen.getByLabelText('Situação')).toBeDefined();
                expect(screen.getByLabelText('Emissão')).toBeDefined();
                expect(screen.getByLabelText('Vencimento')).toBeDefined();
            }
        );

        it(
            'entrega os valores convertidos no envio',
            async () => {
                const onSubmit = vi.fn();

                render(<InvoiceForm
                    invoice={null}
                    customers={[{
                        id: 1,
                        name: 'Cliente de Teste',
                        email: 'cliente@teste.com.br'
                    }]}
                    error={null}
                    fieldErrors={{}}
                    onDelete={() => {}}
                    confirmDelete={false}
                    setConfirmDelete={() => {}}
                    confirm={() => {}}
                    onCancel={() => {}}
                    onSubmit={onSubmit}
                    busy={false}
                />);

                await user.selectOptions(screen.getByLabelText('Cliente'), '1');
                await user.type(screen.getByLabelText('Valor'), '1250.37');
                await user.selectOptions(screen.getByLabelText('Situação'), 'pending');
                await user.type(screen.getByLabelText('Emissão'), '2026-11-01');
                await user.type(screen.getByLabelText('Vencimento'), '2026-11-30');
                await user.click(screen.getByRole('button', { name: 'Salvar' }));

                expect(onSubmit).toHaveBeenCalledWith({
                    customerId: 1,
                    amount: 125037,
                    status: 'pending',
                    issueDate: '2026-11-01',
                    dueDate: '2026-11-30'
                });
            }
        );

        it(
            'não envia o formulário com campo obrigatório vazio',
            async () => {
                const onSubmit = vi.fn();

                render(<InvoiceForm
                    invoice={null}
                    customers={[{
                        id: 1,
                        name: 'Cliente de Teste',
                        email: 'cliente@teste.com.br'
                    }]}
                    error={null}
                    fieldErrors={{}}
                    onDelete={() => {}}
                    confirmDelete={false}
                    setConfirmDelete={() => {}}
                    confirm={() => {}}
                    onCancel={() => {}}
                    onSubmit={onSubmit}
                    busy={false}
                />);

                await user.click(screen.getByRole('button', { name: 'Salvar' }));

                expect(onSubmit).not.toHaveBeenCalled();
            }
        );

        it(
            'desabilita acionamentos durante o processamento',
            async () => {
                render(<InvoiceForm
                    invoice={null}
                    customers={[{
                        id: 1,
                        name: 'Cliente de Teste',
                        email: 'cliente@teste.com.br'
                    }]}
                    error={null}
                    fieldErrors={{}}
                    onDelete={() => {}}
                    confirmDelete={false}
                    setConfirmDelete={() => {}}
                    confirm={() => {}}
                    onCancel={() => {}}
                    onSubmit={() => {}}
                    busy={true}
                />);

                expect(screen.getByRole('button', { name: 'Salvando...'})).toHaveProperty('disabled', true);
                expect(screen.getByRole('button', { name: 'Cancelar'})).toHaveProperty('disabled', true);
            }
        );

        it(
            'apresenta mensagem de falha recebida',
            () => {
                render(<InvoiceForm
                    invoice={null}
                    customers={[{
                        id: 1,
                        name: 'Cliente de Teste',
                        email: 'cliente@teste.com.br'
                    }]}
                    error={'Falha ao criar fatura.'}
                    fieldErrors={{}}
                    onDelete={() => {}}
                    confirmDelete={false}
                    setConfirmDelete={() => {}}
                    confirm={() => {}}
                    onCancel={() => {}}
                    onSubmit={() => {}}
                    busy={false}
                />);

                expect(screen.getByText('Falha ao criar fatura.')).toBeDefined();
            }
        );

        it(
            'preeche os campos com a fatura recebida',
            () => {
                render(<InvoiceForm
                    invoice={{
                        id: 1,
                        amount: 125037,
                        status: 'pending',
                        situation: 'overdue',
                        issueDate: '2026-10-01',
                        dueDate: '2026-10-31',
                        customer: {
                            id: 1,
                            name: 'Cliente de Teste',
                            email: 'cliente@teste.com.br'
                        }
                    }}
                    customers={[{
                        id: 1,
                        name: 'Cliente de Teste',
                        email: 'cliente@teste.com.br'
                    }]}
                    error={null}
                    fieldErrors={{}}
                    onDelete={() => {}}
                    confirmDelete={false}
                    setConfirmDelete={() => {}}
                    confirm={() => {}}
                    onCancel={() => {}}
                    onSubmit={() => {}}
                    busy={false}
                />);

                expect(screen.getByText('Editar fatura')).toBeDefined();
                expect(screen.getByLabelText('Cliente')).toHaveProperty('value', '1');
                expect(screen.getByLabelText('Valor')).toHaveProperty('value', '1250.37');
                expect(screen.getByLabelText('Situação')).toHaveProperty('value', 'pending');
                expect(screen.getByLabelText('Emissão')).toHaveProperty('value', '2026-10-01');
                expect(screen.getByLabelText('Vencimento')).toHaveProperty('value', '2026-10-31');
                expect(screen.getByRole('button', { name: 'Excluir' })).toBeDefined();
            }
        );

        it(
            'devolve o cancelamento sem enviar o formulário',
            async () => {
                const onCancel = vi.fn();
                const onSubmit = vi.fn();

                render(<InvoiceForm
                    invoice={null}
                    customers={[{
                        id: 1,
                        name: 'Cliente de Teste',
                        email: 'cliente@teste.com.br'
                    }]}
                    error={null}
                    fieldErrors={{}}
                    onDelete={() => {}}
                    confirmDelete={false}
                    setConfirmDelete={() => {}}
                    confirm={() => {}}
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                    busy={false}
                />);

                await user.click(screen.getByRole('button', { name: 'Cancelar' }));

                expect(onCancel).toHaveBeenCalledTimes(1);
                expect(onSubmit).not.toHaveBeenCalled();
            }
        );
    }
);
