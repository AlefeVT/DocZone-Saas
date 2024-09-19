import { GetObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '../s3client-config';
import { currentUser } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { Readable } from 'stream';

class FileService {
  static prisma = new PrismaClient();

  static async getFileForUser(fileId: string, userId: string) {
    return await this.prisma.file.findUnique({
      where: { id: fileId, userId },
    });
  }

  static async getS3ObjectStream(fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_S3!,
      Key: fileKey,
    });

    return await s3Client.send(command);
  }

  static streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}

class FileController {
  static async handleRequest(req: NextRequest) {
    const user = await currentUser();

    if (!user || !user.id) {
      return NextResponse.redirect('/auth/login');
    }

    const fileId = this.getFileIdFromRequest(req);
    if (!fileId) {
      return this.createJsonResponse({ error: 'File ID is required' }, 400);
    }

    const file = await FileService.getFileForUser(fileId, user.id);
    if (!file) {
      return this.createJsonResponse({ error: 'File not found' }, 404);
    }

    try {
      const s3Response = await FileService.getS3ObjectStream(file.key);
      const buffer = await FileService.streamToBuffer(
        s3Response.Body as Readable
      );

      // console.log('chamou stream');
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': file.fileType,
          'Content-Disposition': 'inline',
        },
      });
    } catch (error) {
      console.error('Error streaming file from S3:', error);
      return this.createJsonResponse(
        { error: 'Failed to stream file from S3' },
        500
      );
    }
  }

  static getFileIdFromRequest(req: NextRequest): string | null {
    const { searchParams } = new URL(req.url);
    return searchParams.get('fileId');
  }

  static createJsonResponse(data: any, status: number = 200) {
    return NextResponse.json(data, { status });
  }
}

export async function GET(req: NextRequest) {
  return await FileController.handleRequest(req);
}
