import { FileData } from '@/interfaces/FileData';
import axios from 'axios';

export class DocumentService {
  static async fetchFilesByContainer(containerId: string): Promise<FileData[]> {
    if (!containerId) return []; // Se não houver container selecionado, retorne vazio.

    try {
      const { data } = await axios.get(
        `/api/files-actions/get-documents?containerId=${containerId}`
      );
      return data.files || [];
    } catch (error) {
      console.error('Erro ao buscar dados do arquivo (service):', error);
      return [];
    }
  }

  static filterFiles(files: FileData[], searchTerm: string): FileData[] {
    return files.filter((file) =>
      file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
