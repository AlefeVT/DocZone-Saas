import { useState, useEffect, useCallback } from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Container } from '@/interfaces/ContainerTree';

import ContainerNode from './ContainerNode';
import { GETContainers } from '../../actions';

interface ContainerTreeProps {
  onSelectContainer: (containerId: string) => void;
}

const ContainerTree = ({ onSelectContainer }: ContainerTreeProps) => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [filteredContainers, setFilteredContainers] = useState<Container[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [openContainers, setOpenContainers] = useState<string[]>([]);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const data = await GETContainers();
        setContainers(data);
        setFilteredContainers(data);
      } catch (error) {
        console.error('Erro ao buscar containers:', error);
      }
    };
    fetchContainers();
  }, []);

  const filterContainers = useCallback(
    (container: Container, query: string): boolean => {
      const lowerCaseQuery = query.toLowerCase();
      const matchesNameOrDescription =
        container.name.toLowerCase().includes(lowerCaseQuery) ||
        (container.description &&
          container.description.toLowerCase().includes(lowerCaseQuery));

      const matchesChildren = container.children.some((child) =>
        filterContainers(child, query)
      );

      return matchesNameOrDescription || matchesChildren;
    },
    []
  );

  useEffect(() => {
    if (!searchQuery) {
      setFilteredContainers(containers);
      setOpenContainers([]);
      return;
    }

    const filtered = containers.filter((container) =>
      filterContainers(container, searchQuery)
    );

    setFilteredContainers(filtered);

    const openContainersSet = new Set<string>();
    const findParentsToOpen = (container: Container) => {
      if (
        container.children.some((child) => filterContainers(child, searchQuery))
      ) {
        openContainersSet.add(container.id);
      }
      container.children.forEach(findParentsToOpen);
    };

    containers.forEach(findParentsToOpen);
    setOpenContainers(Array.from(openContainersSet));
  }, [searchQuery, containers, filterContainers]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleToggleContainer = (containerId: string) => {
    setOpenContainers((prev) =>
      prev.includes(containerId)
        ? prev.filter((id) => id !== containerId)
        : [...prev, containerId]
    );
  };

  const totalPages = Math.ceil(filteredContainers.length / itemsPerPage);
  const paginatedContainers = filteredContainers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  return (
    <div className="mx-auto max-w-full">
      <div className="relative w-1/2 mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Busque pelo nome ou descrição das caixas..."
          className="pl-10 w-full border border-gray-300 rounded-md shadow-sm"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
        {paginatedContainers.map((container) => (
          <div
            key={container.id}
            className="bg-gray-100 border-l-4 border-blue-500 rounded-md shadow-lg p-4 h-fit"
          >
            <ContainerNode
              container={container}
              isOpen={openContainers.includes(container.id)}
              onSelect={onSelectContainer}
              onToggle={handleToggleContainer}
              openContainers={openContainers}
              isRoot
            />
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <span className="text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default ContainerTree;
