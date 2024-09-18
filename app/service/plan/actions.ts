'use server';

import { PrismaClient } from '@prisma/client';
import { currentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const user = await currentUser();

  if (!user || !user.id) {
    return NextResponse.json(
      { message: 'Usuário não autenticado.' },
      { status: 401 }
    );
  }

  try {
    const userWithSubscription = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        Subscription: true,
      },
    });

    if (!userWithSubscription) {
      return NextResponse.json(
        { message: 'Usuário não encontrado.' },
        { status: 404 }
      );
    }

    if (!userWithSubscription.Subscription) {
      return NextResponse.json(
        { message: 'O usuário não possui uma assinatura ativa.' },
        { status: 200 }
      );
    }

    const subscriptionData = {
      plan: userWithSubscription.Subscription.plan,
      period: userWithSubscription.Subscription.period,
      startDate: userWithSubscription.Subscription.startDate.toISOString(),
      endDate: userWithSubscription.Subscription.endDate.toISOString(),
    };

    return NextResponse.json(subscriptionData, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar o plano do usuário:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar o plano do usuário.' },
      { status: 500 }
    );
  }
}
