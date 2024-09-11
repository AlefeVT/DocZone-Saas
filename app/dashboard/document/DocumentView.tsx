'use client';

import { useState, useEffect } from 'react';
import { Header } from './_components/filePageHeader';
import { SearchBar } from './_components/fileSearchBar';
import { Content } from './_components/fileContent';
import { FileData } from '@/interfaces/FileData';
import { DocumentController } from '@/app/controller/document/DocumentController';
import { DocumentService } from '@/app/service/document/DocumentService';

import { Separator } from '@/components/ui/separator';
import ContainerTree from './_components/containers/ContainersTree';

export default function DocumentView() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedContainer, setSelectedContainer] = useState<string>('');

  useEffect(() => {
    const fetchFiles = async () => {
      if (selectedContainer) {
        setLoading(true);
        try {
          const fetchedFiles = await DocumentController.fetchFilesByContainer(
            DocumentService,
            selectedContainer
          );
          setFiles(fetchedFiles);
        } catch (error) {
          console.error(
            'Falha ao buscar arquivos para o container selecionado:',
            error
          );
        } finally {
          setLoading(false);
        }
      } else {
        setFiles([]);
      }
    };

    fetchFiles();
  }, [selectedContainer]);

  const handleContainerSelect = (containerId: string) => {
    setSelectedContainer(containerId);
  };

  const filteredFiles = DocumentController.filterFilesByContainerAndSearchTerm(
    files,
    selectedContainer,
    searchTerm
  );

  return (
    <div className="p-4">
      <Header viewMode={viewMode} setViewMode={setViewMode} />

      <ContainerTree onSelectContainer={handleContainerSelect} />

      <Separator className="mt-5 mb-5" />

      {/* <h2 className='text-1xl font-semibold text-gray-800 sm:text-2xl'>Documentos</h2> */}

      <div className="flex flex-col sm:flex-row justify-between items-center mt-7 mb-5 space-y-4 sm:space-y-0">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <Content loading={loading} viewMode={viewMode} files={filteredFiles} />
    </div>
  );
}
