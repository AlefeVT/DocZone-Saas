import { PrismaClient } from '@prisma/client';
import { startOfMonth, endOfMonth } from 'date-fns';

export default class DashboardService {
  async getDashboardInfo() {
    const prisma = new PrismaClient();
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

  // Função para obter a quantidade de documentos por container e seus filhos
  private async getDocumentsPerContainer(): Promise<
    { name: string; documentos: number }[]
  > {
    const prisma = new PrismaClient();

    // Definir um limite de containers a serem exibidos (ajuste conforme o tamanho do gráfico)
    const containerLimit = 10;

    // Busca os containers de nível superior (sem pais) com todos os filhos recursivamente
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
                children: true, // Recursivamente pega todos os filhos
              },
            },
          },
        },
      },
    });

    // Função auxiliar para contar documentos em todos os containers filhos recursivamente
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

    // Mapeia os containers principais, conta documentos em seus filhos e ordena pelos mais recentes
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

    // Ordena os containers pelos mais recentes e aplica o limite de containers
    containersWithDocuments = containersWithDocuments
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Ordena por data de criação (mais recente primeiro)
      .slice(0, containerLimit); // Aplica o limite de containers

    return containersWithDocuments.map(({ name, documentos }) => ({
      name,
      documentos,
    }));
  }

  // Função para obter o número de arquivos criados ao longo do tempo
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
          gte: startDate, // A partir do início do mês
          lte: endDate, // Até o final do mês
        },
      },
    });

    // Agrupar por data e remover duplicatas
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
