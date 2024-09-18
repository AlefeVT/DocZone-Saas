import { DocumentCreateService } from '@/app/service/document/DocumentCreateService';

export class DocumentCreateController {
  static async handleSubmit(
    selectedFiles: File[],
    selectedContainer: string,
    setIsLoading: (loading: boolean) => void,
    onSuccess: (fileUrls: string[]) => void,
    onError: (errors: { selectedFile?: string; selectedContainer?: string }) => void,
    setShowUpgradeModal: (show: boolean) => void // Adiciona função para exibir o modal de upgrade
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
          const key = await DocumentCreateService.uploadToS3(file, selectedContainer);
          return key ? DocumentCreateService.generateFileUrl(key) : null;
        })
      );

      onSuccess(fileUrls.filter((url) => url !== null) as string[]);
    } catch (error: any) {
      console.error('Erro durante o upload do arquivo (controller):', error);

      // Verifica se o erro é "Insufficient storage space"
      if (error?.error === 'Insufficient storage space') {
        setShowUpgradeModal(true); // Exibe o modal de upgrade
      } else {
        onError({ selectedFile: 'Erro ao carregar arquivos. Tente novamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  }
}
