import * as React from 'react';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileData } from '@/interfaces/FileData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CircleAlert,
  Download,
  Edit2,
  EyeIcon,
  FileText,
  ImageIcon,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { FileViewerModals } from './fileViewerModals';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

interface FileTableProps {
  files: FileData[];
}

export function FileTable({ files: initialFiles }: FileTableProps) {
  const [selectedFile, setSelectedFile] = React.useState<FileData | null>(null);
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});

  const router = useRouter();

  const handleViewFile = (file: FileData) => {
    if (file.fileType === 'application/pdf') {
      const pdfUrl = `/api/file-stream?fileId=${file.id}`;
      setFileUrl(pdfUrl);
    } else if (file.fileType.startsWith("image/")) {
      setFileUrl(file.url);
    } else {
      toast("Visualização não suportada", {
        icon: <CircleAlert />,
        description: "Só é possível visualizar PDFs e imagens.",
      });
    }
    setSelectedFile(file);
  };

  const confirmDeleteSelectedFiles = () => {
    const selectedFileIds = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => {
        const index = parseInt(key, 10);
        const selectedFile = initialFiles[index];
        return selectedFile?.id;
      })
      .filter((id) => id !== undefined);

    if (selectedFileIds.length > 0) {
      const idsString = selectedFileIds.join(',');
      router.push(`/dashboard/document/${idsString}/delete`);
    }
  };

  const confirmDeleteFile = (file: FileData) => {
    router.push(`/dashboard/document/${file.id}/delete`);
  };

  const table = useReactTable({
    data: initialFiles,
    columns: [
      {
        id: 'select',
        header: ({ table }) => (
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
        accessorKey: 'containerName',
        header: 'Caixa',
        cell: ({ getValue }) => getValue<string>(),
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
                  <Link href={`/dashboard/document/${file.id}`} className="flex items-center w-full">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleViewFile(file)} className="flex items-center cursor-pointer">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Visualizar
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={file.url} download={file.fileName} className="flex items-center cursor-pointer">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => confirmDeleteFile(file)} className="flex items-center cursor-pointer">
                  <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                  Excluir
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={confirmDeleteSelectedFiles}
                  className="flex items-center cursor-pointer"
                  disabled={Object.keys(rowSelection).length === 0} // Desabilita se não houver arquivos selecionados
                >
                  <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                  Excluir Selecionados
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
          
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    meta: {
      onView: handleViewFile,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  <div className="font-medium gap-4 p-4 items-center flex flex-col text-center">
                    <Image
                      height={150}
                      width={150}
                      src="/empty.svg"
                      alt="Imagem vazia"
                    />
                    Nenhum arquivo encontrado. Selecione uma caixa para listar seus documentos.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>

      <FileViewerModals
        selectedFile={selectedFile}
        fileUrl={fileUrl}
        setSelectedFile={setSelectedFile}
      />
    </div>
  );
}
