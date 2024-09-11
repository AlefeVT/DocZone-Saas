'use server';

import { PrismaClient } from '@prisma/client';

export default async function getContainerEdit(id: string) {
  try {
    const prisma = new PrismaClient();

    const container = await prisma.container.findUnique({
      where: {
        id,
      },
      include: {
        user: true, // Inclui os dados do usuário relacionado, se necessário
        files: true, // Inclui os arquivos relacionados a esse container
      },
    });

    if (!container) {
      throw new Error(`Container com id ${id} não encontrado`);
    }

    return {
      id: container.id,
      userId: container.userId,
      name: container.name,
      description: container.description,
      createdAt: container.createdAt,
      user: container.user,
      files: container.files,
    };
  } catch (error) {
    console.error('Erro ao buscar os dados do container:', error);
    throw error;
  }
}

export async function updateContainer(
  id: string,
  name: string,
  description?: string
) {
  try {
    const prisma = new PrismaClient();

    const updatedContainer = await prisma.container.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    return updatedContainer;
  } catch (error) {
    console.error('Erro ao atualizar os dados do container:', error);
    throw error;
  }
}
