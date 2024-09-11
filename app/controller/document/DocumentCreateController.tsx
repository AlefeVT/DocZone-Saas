import { DocumentCreateService } from '@/app/service/document/DocumentCreateService';

export class DocumentCreateController {
  static async handleSubmit(
    selectedFiles: File[],
    selectedContainer: string,
    setIsLoading: (loading: boolean) => void,
    onSuccess: (fileUrls: string[]) => void,
    onError: (errors: {
      selectedFile?: string;
      selectedContainer?: string;
    }) => void
  ) {
    setIsLoading(true);

    const validationResult = DocumentCreateService.validateFileUpload({
      selectedFiles,
      selectedContainer,
    });

    if (!validationResult.success) {
      onError(validationResult.errors);
      setIsLoading(false);
      return;
    }

    try {
      const fileUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const key = await DocumentCreateService.uploadToS3(
            file,
            selectedContainer
          );
          return key ? DocumentCreateService.generateFileUrl(key) : null;
        })
      );

      onSuccess(fileUrls.filter((url) => url !== null) as string[]);
    } catch (error) {
      console.error('Erro durante o upload do arquivo (controller):', error);
      onError({ selectedFile: 'Erro ao carregar arquivos. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  }

  static handleRemoveFile(
    index: number,
    selectedFiles: File[],
    setSelectedFiles: (files: File[]) => void,
    setError: (message: string) => void
  ) {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    if (updatedFiles.length === 0) {
      setError('Um documento válido deve ser selecionado');
    }
  }
}
