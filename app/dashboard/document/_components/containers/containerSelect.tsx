import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ContainerSelectProps {
  containers: { id: string; name: string }[];
  onSelect: (containerId: string) => void;
}

export function ContainerSelect({
  containers,
  onSelect,
}: ContainerSelectProps) {
  const handleSelectChange = (value: string) => {
    onSelect(value === 'all-containers' ? '' : value);
  };

  return (
    <Select onValueChange={handleSelectChange}>
      <SelectTrigger className="w-full sm:w-[300px] lg:w-[400px]">
        <SelectValue placeholder="Todos" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>
            Selecione uma caixa de documentos a serem exibidos
          </SelectLabel>
          <SelectItem value="all-containers">Todos</SelectItem>
          {containers.map((container) => (
            <SelectItem key={container.id} value={container.id}>
              {container.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
