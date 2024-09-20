import { currentUser } from '@/lib/auth';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { s3Client } from '../../s3client-config';

class FileService {
  static prisma = new PrismaClient();

  static async findFilesByIdsAndUser(fileIds: string[], userId: string) {
    return await this.prisma.file.findMany({
      where: {
        id: { in: fileIds },
        userId,
      },
    });
  }

  static async deleteFileRecords(fileIds: string[]) {
    return await this.prisma.file.deleteMany({
      where: {
        id: { in: fileIds },
      },
    });
  }

  static async deleteFilesFromS3(fileKeys: string[]) {
    const deletePromises = fileKeys.map((fileKey) => {
      const s3Params = {
        Bucket: process.env.BUCKET_S3!,
        Key: fileKey,
      };
      const command = new DeleteObjectCommand(s3Params);
      return s3Client.send(command);
    });

    await Promise.all(deletePromises);
  }
}

class FileController {
  static async handleRequest(req: NextRequest) {
    const fileIds = await this.getFileIdsFromRequest(req);

    if (!fileIds || fileIds.length === 0) {
      return this.createJsonResponse(
        {
          error:
            'Os IDs dos arquivos são obrigatórios e devem ser um array não vazio',
        },
        400
      );
    }

    const splitFileIds = fileIds[0]?.split(',') || [];

    if (splitFileIds.length === 0) {
      return this.createJsonResponse(
        {
          error:
            'Os IDs dos arquivos são obrigatórios e devem ser um array não vazio',
        },
        400
      );
    }

    const user = await currentUser();

    if (!user || !user.id) {
      return this.createJsonResponse({ error: 'Usuário não autenticado' }, 401);
    }

    try {
      const files = await FileService.findFilesByIdsAndUser(
        splitFileIds,
        user.id
      );

      if (files.length === 0) {
        return this.createJsonResponse(
          { error: 'Arquivos não encontrados ou não pertencem ao usuário' },
          404
        );
      }

      const fileKeys = files.map((file) => file.key);

      await FileService.deleteFilesFromS3(fileKeys);
      await FileService.deleteFileRecords(splitFileIds);

      return this.createJsonResponse({
        message: 'Arquivos deletados com sucesso',
      });
    } catch (error) {
      console.error(
        'Erro ao deletar arquivos do S3 ou do banco de dados:',
        error
      );
      return this.createJsonResponse(
        { error: 'Falha ao deletar arquivos do S3 ou do banco de dados' },
        500
      );
    } finally {
      await FileService.prisma.$disconnect();
    }
  }

  static async getFileIdsFromRequest(
    req: NextRequest
  ): Promise<string[] | null> {
    try {
      const body = await req.json();
      return body.fileIds || null;
    } catch (error) {
      console.error('Falha ao analisar o corpo da requisição:', error);
      return null;
    }
  }

  static createJsonResponse(data: any, status: number = 200) {
    return NextResponse.json(data, { status });
  }
}

export async function POST(req: NextRequest) {
  return await FileController.handleRequest(req);
}
