import { FileData } from '@/interfaces/FileData';

export class ContainerListController {
  static filtercontainers(
    containers: FileData[],
    searchTerm: string
  ): FileData[] {
    return containers.filter((file) =>
      file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  static async fetchcontainers(ContainerService: any): Promise<FileData[]> {
    return await ContainerService.fetchcontainers();
  }
}
