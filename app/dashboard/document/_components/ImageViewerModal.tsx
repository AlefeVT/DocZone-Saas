import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileUrl: string;
}

export default function ImageViewerModal({
  isOpen,
  onClose,
  fileName,
  fileUrl,
}: ImageViewerModalProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [isOpen]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white rounded-lg shadow-lg max-w-5xl w-full h-[85vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 rounded-t-lg">
          <h2 className="text-xl font-semibold">{fileName}</h2>
          <Button onClick={onClose} variant={'ghost'}>
            ✖
          </Button>
        </div>
        <div className="flex-grow overflow-hidden relative flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <Loader className="animate-spin h-10 w-10" />
            </div>
          )}
          <Image
            src={fileUrl}
            alt={fileName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-b-lg object-contain"
            onLoad={handleImageLoad}
          />
        </div>
      </div>
    </div>
  );
}
