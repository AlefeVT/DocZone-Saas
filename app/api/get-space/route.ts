import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@/lib/auth';

const prisma = new PrismaClient();

export class SpaceService {
  private static readonly PLAN_LIMITS: Record<string, number> = {
    free: 800, // 800 KB para o plano gratuito
    basic: 50 * 1024 * 1024, // 50GB em KB
    intermediary: 100 * 1024 * 1024, // 100GB em KB
    advanced: 150 * 1024 * 1024, // 150GB em KB
    professional: 200 * 1024 * 1024, // 200GB em KB
    custom: Infinity, // Armazenamento ilimitado
  };

  static getPlanLimitBytes(plan: string): number {
    // Converte o limite de KB para bytes
    return this.PLAN_LIMITS[plan] * 1024;
  }

  static async calculateUsedSpaceBytes(userId: string): Promise<number> {
    const files = await prisma.file.findMany({
      where: { userId },
      select: { fileSize: true },
    });

    // Retorna o espaço total utilizado em bytes
    return files.reduce(
      (total, file) => total + parseInt(file.fileSize, 10),
      0
    );
  }

  static async canUserStoreFile(
    userId: string,
    fileSizeBytes: number
  ): Promise<boolean> {
    const user = await this.getUser(userId);
    const planLimitBytes = this.getPlanLimitBytes(user.plan);

    const usedSpaceBytes = await this.calculateUsedSpaceBytes(userId);

    // console.log(
    //   `Plano: ${user.plan} | Limite: ${planLimitBytes} bytes | Espaço utilizado: ${usedSpaceBytes} bytes | Arquivo: ${fileSizeBytes} bytes`
    // );

    return usedSpaceBytes + fileSizeBytes <= planLimitBytes;
  }

  private static async getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

class SpaceController {
  static async handleRequest(req: NextRequest) {
    try {
      const user = await this.getCurrentUser();
      const { fileSizeBytes } = this.validateAndGetParams(req);

      const canStoreFile = await SpaceService.canUserStoreFile(
        user.id,
        fileSizeBytes
      );

      if (canStoreFile) {
        return this.createSuccessResponse('User can store the file');
      } else {
        return this.createErrorResponse('Insufficient storage space', 403);
      }
    } catch (error) {
      console.error('Error checking user space:', error);
      return this.createErrorResponse('Error checking user space', 500);
    }
  }

  private static async getCurrentUser() {
    const user = await currentUser();
    if (!user || !user.id) {
      throw new Error('Unauthorized');
    }
    return user;
  }

  private static validateAndGetParams(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const fileSize = searchParams.get('fileSize');

    if (!fileSize || isNaN(Number(fileSize))) {
      throw new Error('Invalid fileSize provided');
    }

    return { fileSizeBytes: parseInt(fileSize, 10) };
  }

  private static createSuccessResponse(message: string) {
    return NextResponse.json({ message }, { status: 200 });
  }

  private static createErrorResponse(message: string, status: number) {
    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET(req: NextRequest) {
  return await SpaceController.handleRequest(req);
}
