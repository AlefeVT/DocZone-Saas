'use client';

import { DeleteItem } from '@/components/SubmitButtons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function DeleteRoute({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const containerIds = decodeURIComponent(params.id).split(',');

  const isMultiple = containerIds.length > 1;

  const title = isMultiple
    ? 'Você tem certeza absoluta que deseja excluir essas caixas?'
    : 'Você tem certeza absoluta que deseja excluir essa caixa?';

  const description = isMultiple
    ? 'Isso excluirá permanentemente todos os documentos que estão dentro dessas caixas e removerá todos os dados de nossos servidores.'
    : 'Isso excluirá permanentemente todos os documentos que estão dentro dessa caixa e removerá todos os dados de nossos servidores.';

  const handleDelete = async (containerId: string) => {
    setIsLoading(true);
    try {
      await axios.post('/api/files-actions/remove-container-file-s3', { containerId });
      toast.success(
        isMultiple
          ? 'Caixas excluídas com sucesso!'
          : 'Caixa excluída com sucesso!'
      );
      router.push('/dashboard/container');
    } catch (error) {
      console.error('Error deleting container:', error);
      toast.error(
        isMultiple ? 'Erro ao excluir as caixas.' : 'Erro ao excluir a caixa.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleDelete(params.id);
  };

  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button variant={'secondary'} asChild>
            <Link href={'/dashboard/container'}>Cancelar</Link>
          </Button>
          <form onSubmit={handleSubmit}>
            <DeleteItem isLoading={isLoading} />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
