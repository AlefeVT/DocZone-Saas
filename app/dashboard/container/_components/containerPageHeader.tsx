import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">

      <div className='flex flex-col'>
        <h2 className="text-xl sm:text-2xl font-bold">Caixas</h2>
        <p className="text-sm sm:text-md font-semibold text-muted-foreground">
          Organize os documentos cadastrando as caixas onde eles serão armazenados.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button className="w-full sm:w-auto">
          <Link
            href={'/dashboard/container/create'}
            className="flex items-center justify-center gap-2"
          >
            <PlusIcon className="h-4 w-4 text-white" />
            Nova Caixa
          </Link>
        </Button>
      </div>
    </div>
  );
}
