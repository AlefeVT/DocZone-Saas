import { PrismaClient } from '@prisma/client';
import { currentUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function getUserFileKey() {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error('Usuário não autenticado');
  }

  const fileRecord = await prisma.file.findFirst({
    where: {
      userId: user.id,
    },
    select: {
      key: true,
    },
    orderBy: {
      createdAt: 'desc', // Ordena para pegar o arquivo mais recente, se houver mais de um
    },
  });

  if (!fileRecord || !fileRecord.key) {
    throw new Error('Nenhum arquivo encontrado para este usuário');
  }

  return fileRecord.key;
}
