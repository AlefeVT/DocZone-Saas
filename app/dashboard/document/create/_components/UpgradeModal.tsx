import { Button } from '@/components/ui/button';

interface UpgradeModalProps {
  onClose: () => void;
  onUpgradeClick: () => void;
}

export default function UpgradeModal({
  onClose,
  onUpgradeClick,
}: UpgradeModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Espaço insuficiente</h2>
        <p className="mb-6">
          Você atingiu o limite de armazenamento do seu plano atual. Para
          continuar fazendo uploads, você precisa fazer um upgrade para um plano
          superior.
        </p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={onUpgradeClick}>Fazer Upgrade</Button>
        </div>
      </div>
    </div>
  );
}
