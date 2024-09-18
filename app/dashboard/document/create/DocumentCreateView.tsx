"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import FileUploadDropzone from './_components/fileUploadDropzone';
import SelectedFileCard from './_components/selectedFileCard';
import { SubmitButton } from '@/components/SubmitButtons';
import { DocumentCreateController } from '../../../controller/document/DocumentCreateController';
import { useRouter } from 'next/navigation';
import { GetContainersWithoutChildren } from '../../container/actions';
import { fileUploadSchema } from '@/schemas';
import { toast } from 'sonner';
import SearchableSelect from '@/components/SearchableSelect';
import UpgradeModal from './_components/UpgradeModal';

type ErrorState = {
  selectedFile?: string;
  selectedContainer?: string;
};

type SelectItemType = {
  value: string;
  label: string;
  description?: string;
};

export default function DocumentCreateView() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorState>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [containers, setContainers] = useState<SelectItemType[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false); 
  const router = useRouter();

  useEffect(() => {
    const fetchContainers = async () => {
      const data = await GetContainersWithoutChildren();
      setContainers(
        data.map((container: any) => ({
          value: container.id,
          label: container.name,
          description: container.description || '',
        }))
      );
    };
    fetchContainers();
  }, []);

  const handleSuccess = () => {
    setSelectedFiles([]);
    setErrors({});
    toast('Documento criado com sucesso', {
      icon: <CheckCircle />,
      description: 'O documento foi criado e salvo corretamente.',
    });
    router.push('/dashboard/document');
  };

  const handleError = (errorState: ErrorState) => {
    console.error('Erro na validação (view):', errorState);

    // Exibir toast de erro apenas se não for relacionado ao espaço insuficiente
    if (errorState.selectedFile !== 'Insufficient storage space') {
      toast('Erro ao criar documento', {
        icon: <AlertCircle />,
        description: 'Houve um problema ao criar o documento. Por favor, tente novamente.',
      });
    }
    setErrors(errorState);
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      clearFileError();
    }
  };

  const clearFileError = () => setErrors((prevErrors) => ({ ...prevErrors, selectedFile: undefined }));

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const validationInput = { selectedFile: selectedFiles, selectedContainer };
    const validation = fileUploadSchema.safeParse(validationInput);

    if (!validation.success) {
      const formErrors = validation.error.format();
      setErrors({
        selectedFile: formErrors.selectedFile?._errors[0],
        selectedContainer: formErrors.selectedContainer?._errors[0],
      });
      return false;
    }

    clearErrors();
    return true;
  };

  const clearErrors = () => setErrors({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        await DocumentCreateController.handleSubmit(
          selectedFiles,
          selectedContainer!,
          setIsLoading,
          handleSuccess,
          handleError,
          setShowUpgradeModal // Passa o controle do modal para o controlador
        );
      } catch (error) {
        console.error('Erro durante o envio (view):', error);
        toast('Erro ao enviar documento', {
          icon: <AlertCircle />,
          description: 'Ocorreu um erro ao enviar o documento. Tente novamente.',
        });
        setIsLoading(false);
      }
    } else {
      console.error('Falha na validação do formulário (view)');
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full flex items-center mb-10 gap-8">
        <Button variant="outline" size="icon" title="Voltar" asChild>
          <Link href="/dashboard/document">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Carregar Documentos</h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <SearchableSelect
          items={containers}
          selectedValue={selectedContainer}
          onValueChange={setSelectedContainer}
          label="Selecione a Caixa"
          error={errors.selectedContainer}
        />

        {selectedFiles.length === 0 ? (
          <div className="space-y-2">
            <FileUploadDropzone onFileChange={(e) => handleFileChange(e.target.files)} />
            {errors.selectedFile && <p className="text-red-500">{errors.selectedFile}</p>}
          </div>
        ) : (
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between w-full">
                <SelectedFileCard
                  fileName={file.name}
                  fileSize={file.size}
                  showRemoveButton={true}
                  onRemoveClick={() => removeFile(index)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <SubmitButton text="Carregar" isLoading={isLoading} />
        </div>
      </form>

      {/* Modal de aviso para upgrade */}
      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onUpgradeClick={() => router.push('/dashboard/plans')} // Direciona para a página de upgrade
        />
      )}
    </div>
  );
}
