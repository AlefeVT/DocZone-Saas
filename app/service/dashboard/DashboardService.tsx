import { PrismaClient } from '@prisma/client';
import { startOfMonth, endOfMonth } from 'date-fns';
import { currentUser } from '@/lib/auth';

export default class DashboardService {
  async getDashboardInfo() {
    const prisma = new PrismaClient();

    // Obtenção de informações do usuário atual e seu plano de assinatura
    const user = await currentUser();

    if (!user || !user.id) {
      throw new Error('Usuário não autenticado');
    }

    const userWithSubscription = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        Subscription: true,
      },
    });

    if (!userWithSubscription) {
      throw new Error('Usuário não encontrado');
    }

    let subscriptionPlan = 'Plano Free';
    let storageLimit = 5; // Limite de armazenamento padrão (5 GB para plano gratuito)

    if (userWithSubscription.Subscription) {
      subscriptionPlan = userWithSubscription.Subscription.plan;
      // Definir limites de armazenamento com base no plano
      switch (subscriptionPlan) {
        case 'basic':
          storageLimit = 50;
          break;
        case 'intermediate':
          storageLimit = 100;
          break;
        case 'advanced':
          storageLimit = 150;
          break;
        case 'professional':
          storageLimit = 200;
          break;
        default:
          storageLimit = 5; // Free plan default
      }
    }

    // Cálculo das outras métricas do dashboard
    const totalDocuments = await prisma.file.count();
    const totalContainers = await prisma.container.count();
    const totalStorageUsed = await this.calculateTotalStorageUsed();
    const documentsPerContainer = await this.getDocumentsPerContainer();
    const documentCreationOverTime = await this.getDocumentCreationOverTime();

    return {
      totalDocuments,
      totalContainers,
      totalStorageUsed,
      documentsPerContainer,
      documentCreationOverTime,
      subscriptionPlan,
      storageLimit,
    };
  }

  private async calculateTotalStorageUsed(): Promise<{
    size: number;
    unit: string;
  }> {
    const prisma = new PrismaClient();
    const files = await prisma.file.findMany({
      select: {
        fileSize: true,
      },
    });

    const totalSizeInBytes = files.reduce((total: number, file) => {
      const fileSizeInBytes = parseFloat(file.fileSize) || 0;
      return total + fileSizeInBytes;
    }, 0);

    return this.formatBytes(totalSizeInBytes);
  }

  private formatBytes(bytes: number): { size: number; unit: string } {
    if (bytes === 0) return { size: 0, unit: 'Bytes' };
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return { size, unit: sizes[i] };
  }

  private async getDocumentsPerContainer(): Promise<
    { name: string; documentos: number }[]
  > {
    const prisma = new PrismaClient();

    const containerLimit = 10;

    const parentContainers = await prisma.container.findMany({
      where: {
        parentId: null,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: {
          select: { files: true },
        },
        children: {
          select: {
            id: true,
            createdAt: true,
            _count: {
              select: { files: true },
            },
            children: {
              select: {
                id: true,
                createdAt: true,
                _count: {
                  select: { files: true },
                },
                children: true,
              },
            },
          },
        },
      },
    });

    const countDocumentsInChildren = (
      children: {
        id: string;
        _count: { files: number };
        createdAt: Date;
        children?: {
          id: string;
          _count: { files: number };
          createdAt: Date;
          children?: any;
        }[];
      }[]
    ): number => {
      return children.reduce((total: number, child) => {
        const childFilesCount = child._count.files || 0;
        const grandChildFilesCount = countDocumentsInChildren(
          child.children || []
        );
        return total + childFilesCount + grandChildFilesCount;
      }, 0);
    };

    let containersWithDocuments = parentContainers.map((container) => {
      const parentFilesCount = container._count.files;
      const childFilesCount = countDocumentsInChildren(
        container.children || []
      );
      const totalDocuments = parentFilesCount + childFilesCount;

      return {
        name: container.name,
        documentos: totalDocuments,
        createdAt: container.createdAt,
      };
    });

    containersWithDocuments = containersWithDocuments
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, containerLimit);

    return containersWithDocuments.map(({ name, documentos }) => ({
      name,
      documentos,
    }));
  }

  private async getDocumentCreationOverTime(): Promise<
    { data: string; quantidade: number }[]
  > {
    const prisma = new PrismaClient();

    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());

    const documentsCreatedOverTime = await prisma.file.groupBy({
      by: ['createdAt'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const groupedData = documentsCreatedOverTime.reduce(
      (acc, entry) => {
        const date = entry.createdAt.toISOString().slice(0, 10);
        if (!acc[date]) {
          acc[date] = entry._count.id;
        } else {
          acc[date] += entry._count.id;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.keys(groupedData).map((date) => ({
      data: date,
      quantidade: groupedData[date],
    }));
  }
}
