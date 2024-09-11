'use server';

import { PrismaClient } from '@prisma/client';

export default async function getDocumentEdit(id: string) {
  try {
    const prisma = new PrismaClient();

    const document = await prisma.file.findUnique({
      where: { id },
      include: {
        container: true,
        user: true,
        signatures: true,
      },
    });

    if (!document) {
      throw new Error(`Documento com id ${id} não encontrado`);
    }

    return {
      id: document.id,
      containerId: document.containerId,
      userId: document.userId,
      key: document.key,
      fileName: document.fileName,
      fileSize: document.fileSize,
      fileType: document.fileType,
      createdAt: document.createdAt.toISOString(),
      container: document.container
        ? {
            id: document.container.id,
            name: document.container.name,
            description: document.container.description,
            createdAt: document.container.createdAt.toISOString(),
          }
        : null,
      user: document.user
        ? {
            id: document.user.id,
            name: document.user.name,
            email: document.user.email,
          }
        : undefined,
      signatures: document.signatures.map((signature) => ({
        id: signature.id,
        userId: signature.userId,
        fileId: signature.fileId,
        signatureType: signature.signatureType,
        signedAt: signature.signedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Erro ao buscar os dados do documento:', error);
    throw error;
  }
}
