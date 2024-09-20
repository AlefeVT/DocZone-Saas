'use client';

import React, { useState } from 'react';
import FileCard from './fileCard';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface FileData {
  id: string;
  fileName: string;
  fileSize: string;
  url: string;
  fileType: string;
  createdAt: string;
}

interface FileCardListProps {
  files: FileData[];
  viewMode: 'cards' | 'table';
}

export default function FileCardList({ files }: FileCardListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(files.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFiles = files.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      {files.length === 0 ? (
        <div className="font-medium gap-4 p-4 items-center flex flex-col text-center">
          <Image height={150} width={150} src="/empty.svg" alt="Imagem vazia" />
          Nenhum arquivo encontrado. Selecione uma caixa para listar seus
          documentos.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentFiles.map((file) => (
              <FileCard
                url_signed_file={`/api/files-actions/file-stream-s3?fileId=${file.id}`}
                key={file.id}
                file={file}
              />
            ))}
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Próximo
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
