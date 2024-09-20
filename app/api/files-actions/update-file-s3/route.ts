import { currentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

class FileService {
  static prisma = new PrismaClient();

  static async saveFileMetadata(
    userId: string,
    key: string,
    fileName: string,
    fileType: string,
    fileSize: string,
    containerId: string
  ) {
    try {
      const result = await this.prisma.file.create({
        data: {
          userId,
          key,
          fileName,
          fileType,
          fileSize,
          containerId,
        },
      });
      return result;
    } catch (error) {
      console.error('Erro ao salvar metadados no banco de dados:', error);
      throw new Error('Falha ao salvar metadados do arquivo');
    }
  }

  static async updateFileMetadata(fileKey: string, updates: any) {
    try {
      const result = await this.prisma.file.update({
        where: { key: fileKey },
        data: updates,
      });
      return result;
    } catch (error) {
      console.error('Erro ao atualizar metadados no banco de dados:', error);
      throw new Error('Falha ao atualizar metadados do arquivo');
    }
  }
}

class FileController {
  static async handleRequest(req: NextRequest) {
    if (req.method === 'PUT') {
      return this.handlePutRequest(req);
    } else {
      return FileController.createJsonResponse(
        { error: 'Método não permitido' },
        405
      );
    }
  }

  static async handlePutRequest(req: NextRequest) {
    const formData = await req.formData();
    const fileKey = formData.get('fileKey') as string;
    const newFileName = formData.get('newFileName') as string | null;

    const user = await currentUser();

    if (!fileKey || !user || !user.id) {
      return FileController.createJsonResponse(
        { error: 'Dados insuficientes ou usuário não autenticado' },
        400
      );
    }

    const existingFile = await FileService.prisma.file.findUnique({
      where: { key: fileKey },
    });

    if (!existingFile) {
      return FileController.createJsonResponse(
        { error: 'Arquivo não encontrado' },
        404
      );
    }

    try {
      const updates: any = {};

      // Apenas atualizando o nome do arquivo, se for diferente do atual
      if (newFileName && newFileName !== existingFile.fileName) {
        updates.fileName = newFileName;
      }

      // Atualizando o metadado no banco de dados
      const updatedFile = await FileService.updateFileMetadata(
        fileKey,
        updates
      );

      return FileController.createJsonResponse({
        message: 'Nome do arquivo atualizado com sucesso',
        updatedFile,
      });
    } catch (error) {
      console.error(
        'Erro ao atualizar o nome do arquivo no banco de dados:',
        error
      );
      return FileController.createJsonResponse(
        { error: 'Falha ao atualizar o nome do arquivo' },
        500
      );
    } finally {
      await FileService.prisma.$disconnect();
    }
  }

  static createJsonResponse(data: any, status: number = 200) {
    return NextResponse.json(data, { status });
  }
}

export async function PUT(req: NextRequest) {
  return await FileController.handleRequest(req);
}
