import { FileData } from '@/interfaces/FileData';

export class DocumentController {
  /**
   * Filtra os arquivos por nome usando o termo de busca.
   */
  static filterFiles(files: FileData[], searchTerm: string): FileData[] {
    return files.filter((file) =>
      file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Filtra os arquivos por container e termo de busca.
   * Se o `containerId` estiver presente, filtra os arquivos para listar apenas os do container selecionado.
   * Se houver um `searchTerm`, aplica também a filtragem por nome de arquivo.
   */
  static filterFilesByContainerAndSearchTerm(
    files: FileData[],
    containerId: string,
    searchTerm: string
  ): FileData[] {
    let filteredFiles = files;

    // Filtra os arquivos apenas do container selecionado, se `containerId` for fornecido.
    if (containerId) {
      filteredFiles = filteredFiles.filter(
        (file) => file.containerId === containerId
      );
    }

    // Aplica a filtragem pelo termo de busca, se `searchTerm` for fornecido.
    if (searchTerm) {
      filteredFiles = this.filterFiles(filteredFiles, searchTerm);
    }

    return filteredFiles;
  }

  /**
   * Busca os arquivos apenas do container selecionado utilizando o DocumentService.
   */
  static async fetchFilesByContainer(
    DocumentService: any,
    containerId: string
  ): Promise<FileData[]> {
    // Busca arquivos apenas do container especificado
    return await DocumentService.fetchFilesByContainer(containerId);
  }
}
