import { listContainers } from '@/app/dashboard/container/actions';
import { DocumentEditService } from '@/app/service/document/DocumentEditService';
import { DocumentData } from '@/interfaces/DocumentData';
import { fileUpdateSchema } from '@/schemas';

export class DocumentEditController {
  static async getDocumentEditData(id: string): Promise<DocumentData> {
    return await DocumentEditService.getDocumentData(id);
  }

  static async fetchContainers(setContainers: (containers: any[]) => void) {
    const data = await listContainers();
    setContainers(
      data.map((container: any) => ({
        value: container.id,
        label: container.name,
      }))
    );
  }

  static initializeFileData(
    data: DocumentData,
    setSelectedFile: (file: File | null) => void
  ) {
    if (data.fileName && data.fileSize) {
      const simulatedFile = new File([data.fileName], data.fileName, {
        type: data.fileType,
        lastModified: new Date(data.createdAt).getTime(),
      });

      Object.defineProperty(simulatedFile, 'size', {
        value: parseInt(data.fileSize, 10),
        writable: false,
      });

      setSelectedFile(simulatedFile);
    }
  }

  static validateForm(
    validationInput: {
      customFileName: string;
      selectedFile: File | null;
      selectedContainer: string;
    },
    setErrors: (errors: {
      customFileName?: string;
      selectedFile?: string;
      selectedContainer?: string;
    }) => void
  ): boolean {
    const validation = fileUpdateSchema.safeParse(validationInput);

    if (!validation.success) {
      const formErrors = validation.error.format();
      console.error('Form Errors:', formErrors);
      setErrors({
        customFileName: formErrors.customFileName?._errors[0],
        selectedFile: formErrors.selectedFile?._errors[0],
        selectedContainer: formErrors.selectedContainer?._errors[0],
      });
      return false;
    }

    setErrors({});
    return true;
  }

  static async handleSubmit(
    e: React.FormEvent,
    customFileName: string,
    selectedContainer: string,
    selectedFile: File | null,
    data: DocumentData,
    setIsLoading: (isLoading: boolean) => void,
    router: any,
    setErrors: (errors: any) => void
  ) {
    const formData = new FormData();
    formData.append('fileKey', data.key);

    if (customFileName !== data.fileName) {
      formData.append('newFileName', customFileName);
    }
    if (selectedContainer !== data.containerId) {
      formData.append('containerId', selectedContainer);
    }

    if (selectedFile && selectedFile.name !== data.fileName) {
      formData.append('newFileType', selectedFile.type);
      formData.append('newFileSize', selectedFile.size.toString());
      formData.append('file', selectedFile);
    }

    try {
      await DocumentEditService.updateDocument(formData);
      router.push('/dashboard/document');
    } catch (error) {
      console.error('Erro ao atualizar o arquivo:', error);
      setErrors({ selectedFile: 'Erro ao tentar editar o documento!' });
    } finally {
      setIsLoading(false);
    }
  }
}
