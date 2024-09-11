import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, Edit2, EyeIcon, MoreHorizontal, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { FileData } from '@/interfaces/FileData';

export function FileTableActions({
  file,
  setIsSingleDeleteModalOpen,
  setFileToDelete,
  handleViewFile,
}: {
  file: FileData;
  setIsSingleDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFileToDelete: React.Dispatch<React.SetStateAction<FileData | null>>;
  handleViewFile: (file: FileData) => void;
}) {
  const confirmDeleteFile = () => {
    setFileToDelete(file);
    setIsSingleDeleteModalOpen(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href={`/dashboard/document/${file.id}`}
            className="flex items-center w-full"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleViewFile(file)}
          className="flex items-center cursor-pointer"
        >
          <EyeIcon className="h-4 w-4 mr-2" />
          Visualizar
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={file.url}
            download={file.fileName}
            className="flex items-center cursor-pointer"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={confirmDeleteFile}
          className="flex items-center cursor-pointer text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
