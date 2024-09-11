import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import Image from 'next/image';
import {
  FileTextIcon,
  FileSpreadsheetIcon,
  EyeIcon,
  Download,
  MoreHorizontal,
  Edit2,
  Trash2,
  FolderSync,
  FileText,
  Image as ImageIcon,
  CircleAlert,
} from 'lucide-react';
import { useState } from 'react';
import PdfViewerModal from './PdfViewerModal';
import ImageViewerModal from './ImageViewerModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { FileData } from '@/interfaces/FileData';
import { toast } from 'sonner';

interface FileCardProps {
  file: FileData;
  url_signed_file: string;
}

export default function FileCard({ file, url_signed_file }: FileCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleViewFile = () => {
    if (file.fileType === "application/pdf" || file.fileType.startsWith("image/")) {
      setIsModalOpen(true);
    } else {
      toast("Visualização não suportada",{
        icon: <CircleAlert />,
        description: "Só é possível visualizar PDFs e imagens.",
      });
    }
  };

  const renderFilePreview = () => {
    if (file.fileType.startsWith('image/')) {
      return (
        <div className="relative w-full h-48 flex justify-center items-center">
          {isImageLoading && (
            <ImageIcon className="h-12 w-12 text-gray-500 absolute" />
          )}
          <Image
            src={file.url}
            alt={file.fileName}
            width={200}
            height={200}
            className={`w-full h-auto max-h-48 object-cover ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsImageLoading(false)}
          />
        </div>
      );
    } else if (file.fileType === 'application/pdf') {
      return (
        <div className="w-full h-48 flex justify-center items-center">
          {isPdfLoading && <FolderSync className="h-12 w-12 text-gray-500" />}
          <iframe
            src={url_signed_file}
            className={`w-full h-48 ${isPdfLoading ? 'hidden' : ''}`}
            frameBorder="0"
            title="PDF Preview"
            onLoad={() => setIsPdfLoading(false)}
          />
        </div>
      );
    } else if (
      file.fileType.startsWith('application/vnd.ms-excel') ||
      file.fileType.startsWith(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
    ) {
      return (
        <div className='flex flex-col justify-center'>
          <FileSpreadsheetIcon className="h-36 w-36 text-gray-500" />
          <p className="text-gray-700 mt-2">
            Não é possível visualizar documentos que não sejam PDFs ou imagens.
          </p>
        </div>
      );
    } else {
      return (
        <div className='flex flex-col justify-center'>
          <FileTextIcon className="h-36 w-36 text-gray-500 mx-auto" />
          <p className="text-gray-700 mt-2">
            Não é possível visualizar documentos que não sejam PDFs ou imagens.
          </p>
        </div>
      );
    }
  };

  const renderFileIcon = () => {
    if (file.fileType.startsWith('image/')) {
      return <ImageIcon className="min-h-4 min-w-4 mr-2" />;
    } else {
      return <FileText className="min-h-4 min-w-4 mr-2" />;
    }
  };

  return (
    <>
      <Card key={file.id} className="w-[350px] relative">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center break-all">
              {renderFileIcon()}
              <span className="ml-2">{file.fileName}</span>
            </CardTitle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-h-8 min-w-8 ml-4 p-0">
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
                    className="flex items-center"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link
                    href={`/dashboard/document/${file.id}/delete`}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <a
                    href={url_signed_file}
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleViewFile()}
                  className="flex items-center cursor-pointer"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Visualizar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription>Tipo: {file.fileType}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-2">
            Criado em: {new Date(file.createdAt).toLocaleString()}
          </p>
          <div className="flex justify-center items-center h-48 mb-2">
            {renderFilePreview()}
          </div>
        </CardContent>
      </Card>

      {file.fileType === 'application/pdf' && (
        <PdfViewerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fileName={file.fileName}
          fileUrl={url_signed_file}
        />
      )}

      {file.fileType.startsWith('image/') && (
        <ImageViewerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fileName={file.fileName}
          fileUrl={file.url}
        />
      )}
    </>
  );
}
