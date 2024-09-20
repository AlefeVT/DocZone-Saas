import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user || !user.email) {
    return new Response(JSON.stringify({ message: 'Você não está autenticado' }), { status: 401 });
  }

  try {
    const foundUser = await prisma.user.findUnique({
      where: { email: user.email }, // Certifique-se de que o email está correto
      include: {
        Subscription: true, // Nome correto do relacionamento
      },
    });

    if (!foundUser) {
      return new Response(JSON.stringify({ message: 'Usuário não encontrado' }), { status: 404 });
    }

    const { plan, Subscription } = foundUser;
    const { endDate, status } = Subscription || {};
    
    let daysUntilExpiration = null;
    let timeUntilExpiration = null;

    if (endDate) {
      const now = new Date();
      const expirationDate = new Date(endDate);
      const timeDiff = expirationDate.getTime() - now.getTime();

      if (timeDiff < 0) {
        timeUntilExpiration = 'Já expirou';
      } else {
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hoursDiff = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        if (daysDiff > 0) {
          daysUntilExpiration = daysDiff; // Retorna a quantidade de dias se for mais de 1 dia
        } else if (hoursDiff > 0 || minutesDiff > 0) {
          timeUntilExpiration = `${hoursDiff}h ${minutesDiff}m`; // Retorna horas e minutos restantes
        }
      }
    }

    const response = {
      plan,
      endDate: endDate ? new Date(endDate).toISOString() : null, // Certifique-se que `endDate` seja um objeto Date válido
      isCanceled: status === 'canceled',
      daysUntilExpiration, // Dias restantes
      timeUntilExpiration, // Horas e minutos ou mensagem de expirado
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error('Erro ao consultar plano de assinatura:', error);
    return new Response(JSON.stringify({ message: 'Erro interno do servidor' }), { status: 500 });
  }
}
