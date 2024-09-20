'use client';

import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import ErrorState from './_components/errorState';
import PlanInfoCard from './_components/planInfoCard';
import PlanActions from './_components/planActions';
import PlanFooter from './_components/planFooter';
import { Skeleton } from '@/components/ui/skeleton'; // Importando o componente Skeleton
import { PlanInfo } from '@/interfaces/PlanInfo';


export default function PlansView() {
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/plan-info');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao carregar informações do plano');
      setPlanInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanInfo();
  }, []);

  if (error) return <ErrorState error={error} />;

  return (
    <div className="flex flex-col w-full px-4 md:px-8 lg:px-16">
      <div className="w-full max-w-4xl mx-auto p-4">

        <header className="flex flex-col mb-6">
          {loading ? (
            <>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-center sm:text-left">Gerenciar Assinatura</h2>
              <p className="text-sm md:text-base text-muted-foreground text-center sm:text-left">
                Acesse o portal do cliente para alterar seu plano ou cancelar sua assinatura.
              </p>
            </>
          )}
        </header>

        {loading ? (
          <Skeleton className="h-64 w-full mb-6" />
        ) : (
          planInfo && <PlanInfoCard planInfo={planInfo} />
        )}

        {loading ? (
          <Skeleton className="h-12 w-full mb-6" />
        ) : (
          <PlanActions onRefresh={fetchPlanInfo} />
        )}

        <Separator className="my-8" />

        {loading ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <PlanFooter />
        )}
      </div>
    </div>
  );
}
