'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/SubmitButtons';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { updateContainer } from '../actions';

export default function ContainerEditForm({ data }: { data: any }) {
  const [name, setName] = useState<string>(data.name || '');
  const [description, setDescription] = useState<string>(
    data.description || ''
  );
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setName(data.name || '');
    setDescription(data.description || '');
  }, [data]);

  const handleSuccess = () => {
    toast.success('Caixa atualizada com sucesso!');
    router.push('/dashboard/container');
  };

  const handleError = (errors: { name?: string; description?: string }) => {
    setErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateContainer(data.id, name, description);
      handleSuccess();
    } catch (error) {
      handleError({
        name: 'Ocorreu um erro ao atualizar a caixa. Tente novamente.',
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full flex items-center mb-10 gap-8">
        <Button variant={'outline'} size={'icon'} title="Voltar" asChild>
          <Link href={'/dashboard/container'}>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Editar Caixa</h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nome da caixa
          </Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors({ ...errors, name: undefined });
              }
            }}
            className="block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Digite o nome da caixa"
            required
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descrição (Opcional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) {
                setErrors({ ...errors, description: undefined });
              }
            }}
            className="block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Descreva a caixa (opcional)"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-end">
          <SubmitButton text="Atualizar" isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
}
