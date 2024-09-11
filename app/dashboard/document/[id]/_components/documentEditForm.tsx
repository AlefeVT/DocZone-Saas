'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import SelectedFileCard from '../../create/_components/selectedFileCard';
import { SubmitButton } from '@/components/SubmitButtons';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { DocumentData } from '@/interfaces/DocumentData';
import { DocumentEditController } from '@/app/controller/document/DocumentEditController';

export function DocumentEditForm({
  initialData,
}: {
  initialData: DocumentData;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customFileName, setCustomFileName] = useState<string>(
    initialData.fileName || ''
  );
  const [selectedContainer, setSelectedContainer] = useState<string>(
    initialData.containerId || ''
  );
  const [errors, setErrors] = useState<{
    customFileName?: string;
    selectedFile?: string;
    selectedContainer?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [data, setData] = useState<DocumentData>(initialData);

  useEffect(() => {
    async function fetchUpdatedData() {
      const updatedData = await DocumentEditController.getDocumentEditData(
        data.id
      );
      setData(updatedData);
      setCustomFileName(updatedData.fileName || '');
      setSelectedContainer(updatedData.containerId || '');
      DocumentEditController.initializeFileData(updatedData, setSelectedFile);
    }

    fetchUpdatedData();
  }, [data.id]);

  function validateForm() {
    const validationInput = {
      customFileName,
      selectedFile,
      selectedContainer,
    };

    return DocumentEditController.validateForm(validationInput, setErrors);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    if (validateForm()) {
      try {
        await DocumentEditController.handleSubmit(
          e,
          customFileName,
          selectedContainer,
          selectedFile,
          data,
          setIsLoading,
          router,
          setErrors
        );
      } catch (error) {
        console.error('Erro ao atualizar o arquivo:', error);
        toast.error('Erro ao tentar editar o documento!');
        setIsLoading(false);
      }
    } else {
      console.error('Falha na validação do formulário');
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full flex items-center mb-10 gap-8">
        <Button variant={'outline'} size={'icon'} title="Voltar" asChild>
          <Link href={'/dashboard/document'}>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>

        <h2 className="text-2xl font-bold">Editar Documento</h2>
      </div>

      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label
            htmlFor="customFileName"
            className="block text-sm font-medium text-gray-700"
          >
            Nome do documento
          </Label>
          <Input
            type="text"
            id="customFileName"
            value={customFileName}
            onChange={(e) => {
              setCustomFileName(e.target.value);
              setErrors((prevErrors) => ({
                ...prevErrors,
                customFileName: undefined,
              }));
            }}
            className="block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Digite o nome do documento"
            required
          />
          {errors.customFileName && (
            <p className="text-red-500">{errors.customFileName}</p>
          )}
        </div>

        <SelectedFileCard
          fileName={
            selectedFile ? selectedFile.name : 'Arquivo não selecionado'
          }
          fileSize={selectedFile ? selectedFile.size : 0}
        />

        <div className="flex justify-end">
          <SubmitButton text="Atualizar" isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
}
