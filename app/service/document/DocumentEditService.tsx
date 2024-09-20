import { toast } from 'sonner';
import { DocumentData } from '@/interfaces/DocumentData';
import getDocumentEdit from '@/app/dashboard/document/[id]/actions';

export class DocumentEditService {
  static async getDocumentData(id: string): Promise<DocumentData> {
    const response = await getDocumentEdit(id);
    return response;
  }

  static async updateDocument(formData: FormData) {
    try {
      const response = await fetch('/api/files-actions/update-file-s3', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar o arquivo');
      }

      toast.success('Documento editado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o arquivo:', error);
      toast.error('Erro ao tentar editar o documento!');
      throw error;
    }
  }
}
