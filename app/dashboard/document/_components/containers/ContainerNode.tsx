import { ChevronRight, Package, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/interfaces/ContainerTree';

interface ContainerNodeProps {
  container: Container;
  isOpen: boolean;
  onSelect: (containerId: string) => void;
  onToggle: (containerId: string) => void;
  openContainers: string[];
  isRoot: boolean;
}

const ContainerNode: React.FC<ContainerNodeProps> = ({
  container,
  isOpen,
  onSelect,
  onToggle,
  openContainers,
}) => {
  const handleSelectContainer = () => {
    onSelect(container.id);
  };

  const handleToggleContainer = () => {
    if (container.children.length === 0) {
      handleSelectContainer();
    }
    onToggle(container.id);
  };

  return (
    <div className="pl-4">
      <Button
        onClick={handleToggleContainer}
        className="flex items-center space-x-2 p-2 text-blue-600 hover:text-blue-800"
        variant="ghost"
        title={container.description || 'Sem descrição disponível'}
      >
        {container.children.length > 0 ? (
          <ChevronRight
            className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            size={20}
          />
        ) : (
          <ExternalLink
            size={16}
            className="text-gray-500"
            onClick={handleSelectContainer}
          />
        )}
        <Package size={20} className="text-gray-600" />
        <span className="text-base font-medium">{container.name}</span>
      </Button>

      {/* Renderiza os containers filhos, se abertos */}
      {isOpen && container.children.length > 0 && (
        <div className="pl-6">
          {container.children.map((child) => (
            <ContainerNode
              key={child.id}
              container={child}
              isOpen={openContainers.includes(child.id)}
              onSelect={onSelect}
              onToggle={onToggle}
              openContainers={openContainers}
              isRoot={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContainerNode;
