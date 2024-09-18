'use client';

import { useState, useEffect } from 'react';
import { Header } from './_components/containerPageHeader';
import { SearchBar } from './_components/containerSearchBar';
import { Content } from './_components/containerContent';
import {
  listContainers,
  GetContainersWithoutChildren,
  GetContainersWithoutParent,
} from './actions';
import ContainerTypeSelect from './_components/containerTypeSelect';

export default function ContainerView() {
  const [containers, setContainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [containerType, setContainerType] = useState('all');

  useEffect(() => {
    const fetchContainers = async () => {
      setLoading(true);
      try {
        let fetchedContainers;

        switch (containerType) {
          case 'no-children':
            fetchedContainers = await GetContainersWithoutChildren();
            break;
          case 'no-parent':
            fetchedContainers = await GetContainersWithoutParent();
            break;
          case 'with-parent-children':
            fetchedContainers = await listContainers();
            break;
          case 'all':
          default:
            fetchedContainers = await listContainers();
            break;
        }

        setContainers(fetchedContainers);
      } catch (error) {
        console.error('Erro ao buscar containers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContainers();
  }, [containerType]);

  const filterContainers = () => {
    return containers.filter((container) =>
      container.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredContainers = filterContainers();

  return (
    <div className="p-4">
      <Header />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 space-y-4 md:space-y-0">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ContainerTypeSelect onSelectType={setContainerType} />
      </div>

      <Content loading={loading} containers={filteredContainers} />
    </div>
  );
}
