import prisma from './prisma.ts';

interface CustomerOption {
    id: number;
    name: string;
    email: string;
}

export async function findCustomersOptions(): Promise<CustomerOption[]> {
    return await prisma.customer.findMany({
        select: {
            id: true,
            name: true,
            email: true
        },
        orderBy: { name: 'asc' }
    });
}
