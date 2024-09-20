import { currentUser } from '@/lib/auth';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '../../s3client-config';
import { PrismaClient } from '@prisma/client';
import { SpaceService } from '../../get-space/route';

class FileService {
  static prisma = new PrismaClient();

  static async createFileRecord(
    userId: string,
    containerId: string,
    key: string,
    fileName: string,
    fileSize: string,
    fileType: string
  ) {
    return await this.prisma.file.create({
      data: {
        userId,
        containerId,
        key,
        fileName,
        fileSize,
        fileType,
      },
    });
  }

  static async generateSignedUrl(key: string, fileType: string) {
    const s3Params = {
      Bucket: process.env.BUCKET_S3!,
      Key: key,
      ContentType: fileType,
    };

    const command = new PutObjectCommand(s3Params);
    return await getSignedUrl(s3Client, command, { expiresIn: 60 });
  }
}

class FileController {
  static async handleRequest(req: NextRequest) {
    const { fileType, fileName, fileSize, containerId } =
      this.getQueryParams(req);
    const user = await currentUser();

    if (!fileType || !fileName || !fileSize || !containerId) {
      return this.createValidationErrorResponse(
        'fileType, fileName, fileSize, and containerId are required and must be strings'
      );
    }

    if (!user || !user.id) {
      return redirect('/auth/login');
    }

    // Verificação de espaço antes de permitir o upload
    const fileSizeInKB = parseInt(fileSize, 10); // Convertendo para KB
    const canStore = await SpaceService.canUserStoreFile(user.id, fileSizeInKB);

    if (!canStore) {
      return this.createJsonResponse(
        { error: 'Insufficient storage space' },
        403
      );
    }

    // Gerar a chave do arquivo
    const key = await this.generateFileKey(user.id, containerId, fileType);

    try {
      // Gera a URL de upload assinada
      const uploadUrl = await FileService.generateSignedUrl(key, fileType);

      // Cria o registro do arquivo no banco de dados
      await FileService.createFileRecord(
        user.id,
        containerId,
        key,
        fileName,
        fileSize,
        fileType
      );

      return this.createJsonResponse({ uploadUrl, key });
    } catch (error) {
      console.error(
        'Error generating signed URL or saving file metadata:',
        error
      );
      return this.createJsonResponse(
        { error: 'Failed to generate signed URL or save file metadata' },
        500
      );
    }
  }

  static getQueryParams(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const fileType = searchParams.get('fileType');
    const fileName = searchParams.get('fileName');
    const fileSize = searchParams.get('fileSize');
    const containerId = searchParams.get('containerId');
    return { fileType, fileName, fileSize, containerId };
  }

  static createValidationErrorResponse(message: string) {
    return NextResponse.json({ error: message }, { status: 400 });
  }

  static createJsonResponse(data: any, status: number = 200) {
    return NextResponse.json(data, { status });
  }

  static async generateFileKey(
    userId: string,
    containerId: string,
    fileType: string
  ) {
    const extension = fileType.split('/')[1];

    // Buscar a hierarquia do container (pai e filho)
    const containerHierarchy = await this.getContainerHierarchy(containerId);

    // Montar o caminho completo no S3, incluindo pasta pai e pasta filho
    const containerPath = containerHierarchy.join('/');

    return `${userId}/${containerPath}/${randomUUID()}.${extension}`;
  }

  // Função auxiliar para buscar a hierarquia de containers
  static async getContainerHierarchy(containerId: string): Promise<string[]> {
    const prisma = new PrismaClient();

    interface Container {
      id: string;
      name: string;
      parentId: string | null;
    }

    const hierarchy: string[] = [];
    let currentContainerId: string | null = containerId;

    while (currentContainerId) {
      const container: Container | null = await prisma.container.findUnique({
        where: { id: currentContainerId },
        select: { id: true, name: true, parentId: true },
      });

      if (container) {
        hierarchy.unshift(container.name);
        currentContainerId = container.parentId;
      } else {
        currentContainerId = null;
      }
    }

    return hierarchy;
  }
}

export async function GET(req: NextRequest) {
  return await FileController.handleRequest(req);
}
