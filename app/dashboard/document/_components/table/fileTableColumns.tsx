import { ColumnDef } from '@tanstack/react-table';
import {
  FileText,
  Image as ImageIcon,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { FileData } from '@/interfaces/FileData';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { FileTableActions } from './fileTableActions';
import { Button } from '@/components/ui/button';

export function FileTableColumns({
  setIsSingleDeleteModalOpen,
  setFileToDelete,
  handleViewFile,
  confirmDeleteSelectedFiles,
}: {
  files: FileData[];
  setFiles: React.Dispatch<React.SetStateAction<FileData[]>>;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSingleDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFileToDelete: React.Dispatch<React.SetStateAction<FileData | null>>;
  handleViewFile: (file: FileData) => void;
  confirmDeleteSelectedFiles: (table: any) => void;
}): ColumnDef<FileData>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
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
              <DropdownMenuItem
                onClick={() => confirmDeleteSelectedFiles(table)}
                className="flex items-center cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Selecionados
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'fileName',
      header: 'Nome do Arquivo',
      cell: ({ row }) => {
        const file = row.original;
        const icon = file.fileType.startsWith('image/') ? (
          <ImageIcon className="h-4 w-4 mr-2" />
        ) : (
          <FileText className="h-4 w-4 mr-2" />
        );
        return (
          <div className="flex items-center">
            {icon}
            {file.fileName}
          </div>
        );
      },
    },
    {
      accessorKey: 'fileType',
      header: 'Tipo de Arquivo',
    },
    {
      accessorKey: 'createdAt',
      header: 'Data de Carregamento',
      cell: ({ getValue }) => {
        const date = new Date(getValue<string>());
        return new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(date);
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const file = row.original;
        return (
          <FileTableActions
            file={file}
            setIsSingleDeleteModalOpen={setIsSingleDeleteModalOpen}
            setFileToDelete={setFileToDelete}
            handleViewFile={handleViewFile}
          />
        );
      },
    },
  ];
}
