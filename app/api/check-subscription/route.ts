import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { Subscription: true },
  });

  if (user && user.Subscription) {
    const currentDate = new Date().getTime();
    const expirationDate = new Date(user.Subscription.endDate).getTime();

    if (expirationDate < currentDate && user.Subscription.plan !== 'free') {
      // Atualiza o plano na tabela User e o plano e status na tabela Subscription
      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: { plan: 'free' },
        }),
        prisma.subscription.update({
          where: { id: user.Subscription.id },
          data: { plan: 'free', status: 'active' }, 
        }),
      ]);

      return NextResponse.json({ message: 'Subscription updated to free and active' }, { status: 200 });
    }
  }

  return NextResponse.json({ message: 'Subscription is active' }, { status: 200 });
}
