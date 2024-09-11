import { FileData } from '@/interfaces/FileData';
import FileCardList from './fileCardList';
import { FileCardSkeleton } from './fileCardSkeleton';
import { FileTableSkeleton } from './fileTableSkeleton';
import { FileTable } from './table/fileTable';

export function Content({
  loading,
  viewMode,
  files,
}: {
  loading: boolean;
  viewMode: 'cards' | 'table';
  files: FileData[];
}) {
  if (loading) {
    return viewMode === 'cards' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <FileCardSkeleton key={index} />
        ))}
      </div>
    ) : (
      <FileTableSkeleton />
    );
  }

  return viewMode === 'cards' ? (
    <FileCardList viewMode={viewMode} files={files} />
  ) : (
    <FileTable files={files} />
  );
}
