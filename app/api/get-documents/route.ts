import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';
import { s3Client } from '../s3client-config';
import { currentUser } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

class FileService {
  static prisma = new PrismaClient();

  static async getFilesForUserByContainer(userId: string, containerId: string) {
    return await this.prisma.file.findMany({
      where: {
        userId,
        containerId, // Filtra pelo container selecionado
      },
      select: {
        id: true,
        key: true,
        fileName: true,
        fileType: true,
        createdAt: true,
        container: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async generateSignedUrl(fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_S3!,
      Key: fileKey,
      ResponseContentDisposition: 'inline',
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }
}

class FileController {
  static async handleRequest(containerId: string) {
    const user = await currentUser();

    if (!user || !user.id) {
      return redirect('/auth/login');
    }

    try {
      const files = await FileService.getFilesForUserByContainer(
        user.id,
        containerId
      );

      if (!files || files.length === 0) {
        return this.createJsonResponse({ files: [] }, 200);
      }

      const filesWithUrls = await Promise.all(
        files.map(async (file) => ({
          id: file.id,
          fileName: file.fileName,
          fileType: file.fileType,
          createdAt: file.createdAt,
          containerId: file.container?.id,
          containerName: file.container?.name || 'Sem Container',
          url: await FileService.generateSignedUrl(file.key),
        }))
      );

      // console.log('chamou api documents');
      return this.createJsonResponse({ files: filesWithUrls });
    } catch (error) {
      console.error('Error generating access URLs:', error);
      return this.createJsonResponse(
        { error: 'Failed to generate access URLs' },
        500
      );
    }
  }

  static createJsonResponse(data: any, status: number = 200) {
    return NextResponse.json(data, { status });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const containerId = url.searchParams.get('containerId');

  if (!containerId) {
    return FileController.createJsonResponse({ files: [] }, 200); // Se não houver container, retorna vazio.
  }

  return await FileController.handleRequest(containerId);
}
