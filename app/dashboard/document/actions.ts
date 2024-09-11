'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FileData {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  createdAt: string;
}

interface ContainerData {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  files: FileData[];
  children: ContainerData[]; // Aninhamento de containers
}

async function fetchChildren(containerId: string): Promise<ContainerData[]> {
  const container = await prisma.container.findUnique({
    where: { id: containerId },
    include: {
      files: true,
      children: true, // Inclui os filhos diretos
    },
  });

  if (!container) return [];

  const childrenWithFiles: ContainerData[] = await Promise.all(
    container.children.map(async (child) => ({
      id: child.id,
      name: child.name,
      description: child.description,
      createdAt: child.createdAt.toISOString(),
      files: await prisma.file
        .findMany({
          where: { containerId: child.id },
          select: {
            id: true,
            fileName: true,
            fileSize: true,
            fileType: true,
            createdAt: true,
          },
        })
        .then((files) =>
          files.map((file) => ({
            ...file,
            createdAt: file.createdAt.toISOString(),
          }))
        ),
      children: await fetchChildren(child.id), // Recurse nos filhos
    }))
  );

  return childrenWithFiles;
}

export async function GETContainers(): Promise<ContainerData[]> {
  try {
    const containers = await prisma.container.findMany({
      where: { parentId: null }, // Busca os containers raiz
      include: {
        files: true, // Inclui os arquivos do container raiz
      },
    });

    if (!containers) {
      throw new Error('Nenhum container encontrado');
    }

    const containersWithFiles: ContainerData[] = await Promise.all(
      containers.map(async (container) => ({
        id: container.id,
        name: container.name,
        description: container.description,
        createdAt: container.createdAt.toISOString(),
        files: container.files.map((file) => ({
          id: file.id,
          fileName: file.fileName,
          fileSize: file.fileSize,
          fileType: file.fileType,
          createdAt: file.createdAt.toISOString(),
        })),
        children: await fetchChildren(container.id), // Busca todos os filhos recursivamente
      }))
    );

    return containersWithFiles;
  } catch (error) {
    console.error('Erro ao buscar os containers:', error);
    throw error;
  }
}
