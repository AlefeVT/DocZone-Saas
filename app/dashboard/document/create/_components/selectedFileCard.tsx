import { FileTextIcon, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SelectedFileCardProps {
  fileName: string;
  fileSize: number;
  showRemoveButton?: boolean;
  onRemoveClick?: () => void;
}

export default function SelectedFileCard({
  fileName,
  fileSize,
  showRemoveButton = false,
  onRemoveClick,
}: SelectedFileCardProps) {
  return (
    <div className="flex items-center w-full justify-between p-4 border rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:border-gray-600">
      <div className="flex items-center">
        <div className="mr-4">
          <FileTextIcon />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {fileName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round(fileSize / 1024)} KB
          </p>
        </div>
      </div>
      {showRemoveButton && onRemoveClick && (
        <Button
          variant="outline"
          size="icon"
          title="Remover"
          onClick={onRemoveClick}
          type='button'
          className="ml-2"
        >
          <XCircle className="w-6 h-6 text-red-500" />
        </Button>
      )}
    </div>
  );
}
