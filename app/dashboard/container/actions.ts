'use server';

import { PrismaClient } from '@prisma/client';

export async function listContainers() {
  const prisma = new PrismaClient();

  const containers = await prisma.container.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      files: {
        select: {
          id: true,
        },
      },
    },
  });

  const containerData = containers.map((container) => ({
    ...container,
    filesCount: container.files.length,
  }));

  return containerData;
}

export async function GetContainersWithoutChildren() {
  const prisma = new PrismaClient();

  // Lista todos os containers que não possuem subcontainers (filhos)
  const containers = await prisma.container.findMany({
    where: {
      NOT: {
        children: {
          some: {}, // Verifica se não há filhos
        },
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      files: {
        select: {
          id: true,
        },
      },
    },
  });

  // Retorna os dados dos containers com a contagem de arquivos
  const containerData = containers.map((container) => ({
    ...container,
    filesCount: container.files.length,
  }));

  return containerData;
}

export async function GetContainersWithoutParent() {
  const prisma = new PrismaClient();

  // Busca todos os containers que não possuem 'parentId'
  const containers = await prisma.container.findMany({
    where: {
      parentId: null, // Verifica containers sem pai
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      files: {
        select: {
          id: true,
        },
      },
    },
  });

  // Mapeia os dados adicionando a contagem de arquivos
  const containerData = containers.map((container) => ({
    ...container,
    filesCount: container.files.length,
  }));

  return containerData;
}
