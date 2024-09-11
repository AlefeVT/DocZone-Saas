import axios from 'axios';
import { toast } from 'sonner';

export class DocumentCreateService {
  static validateFileUpload(data: {
    selectedFiles: File[];
    selectedContainer: string;
  }) {
    const errors: { selectedFile?: string; selectedContainer?: string } = {};

    if (data.selectedFiles.length === 0) {
      errors.selectedFile = 'Pelo menos um arquivo deve ser selecionado';
    }

    if (!data.selectedContainer) {
      errors.selectedContainer = 'Por favor, selecione uma caixa';
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        errors,
      };
    }

    return { success: true, errors: {} };
  }

  static async uploadToS3(
    file: File,
    selectedContainer: string
  ): Promise<string | null> {
    try {
      const { uploadUrl, key } = await this.getUploadUrl(
        file,
        selectedContainer
      );

      await axios.put(uploadUrl, file);

      return key;
    } catch (error) {
      console.error('Erro ao carregar o arquivo (service):', error);
      toast('Falha ao carregar o arquivo');
      return null;
    }
  }

  private static async getUploadUrl(file: File, containerId: string) {
    const fileName = encodeURIComponent(file.name);
    const fileType = encodeURIComponent(file.type);
    const fileSize = encodeURIComponent(file.size);

    const { data } = await axios.get(
      `/api/media?fileType=${fileType}&fileName=${fileName}&fileSize=${fileSize}&containerId=${containerId}`
    );

    return data;
  }

  static generateFileUrl(key: string): string {
    return `/api/get-documents?key=${encodeURIComponent(key)}`;
  }
}
