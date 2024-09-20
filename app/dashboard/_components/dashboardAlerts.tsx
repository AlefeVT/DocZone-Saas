import React from 'react';

interface DashboardAlertsProps {
  isPlanCanceled: boolean;
  daysUntilExpiration: number | null;
  storagePercentage: number;
}

export default function DashboardAlerts({
  isPlanCanceled,
  daysUntilExpiration,
  storagePercentage,
}: DashboardAlertsProps) {
  return (
    <>
      {/* Alerta de cancelamento de plano */}
      {isPlanCanceled && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mt-4" role="alert">
          <strong className="font-bold">Atenção:</strong>
          <span className="block sm:inline">
            Seu plano foi cancelado e será revertido para o Plano Free em {daysUntilExpiration} dias. Todos os documentos serão bloqueados e removidos após o término do plano.
          </span>
        </div>
      )}

      {/* Alerta de armazenamento completo */}
      {storagePercentage >= 100 && (
       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
       <strong className="font-bold">Aviso:</strong>
       <span className="block sm:inline">
         Você atingiu o limite de armazenamento. Considere expandir seu plano para continuar utilizando o sistema.
       </span>
       <div className="mt-3">
         <a 
           href="/dashboard/plans" 
           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
         >
           Expandir Plano
         </a>
       </div>
     </div>
      )}
    </>
  );
}
