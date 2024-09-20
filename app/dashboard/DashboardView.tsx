'use client';

import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { FileText, Box, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoCard } from './_components/dashboardInfoCards';
import { DocumentBarChart } from './_components/DocumentBarChart';
import { DocumentLineChart } from './_components/DocumentLineChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { convertToKB, formatStorageSize } from '@/lib/formatStorageSize';
import DashboardAlerts from './_components/dashboardAlerts';

export default function DashboardView() {
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(true); 
  const [animatedData, setAnimatedData] = useState({
    totalDocuments: 0,
    totalContainers: 0,
    totalStorageUsed: {
      size: 0,
      unit: 'KB',
    },
    storageLimit: 5 * 1024 * 1024, // Limite padrão para o plano Free (em KB)
    planName: 'Plano Free',
    isPlanCanceled: false, 
    daysUntilExpiration: null, 
  });

  const [dataBar, setDataBar] = useState([]);
  const [dataLine, setDataLine] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();

        // Converte o valor usado para KB, se necessário
        const totalStorageUsedInKB = convertToKB(
          data.totalStorageUsed.size,
          data.totalStorageUsed.unit
        );

        setAnimatedData((prevData) => ({
          ...prevData,
          totalDocuments: data.totalDocuments,
          totalContainers: data.totalContainers,
          totalStorageUsed: {
            size: totalStorageUsedInKB,
            unit: 'KB',
          },
        }));

        setDataBar(data.documentsPerContainer);
        setDataLine(data.documentCreationOverTime);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchPlanInfo() {
      try {
        const response = await fetch('/api/plan-info');
        const data = await response.json();

        // Converte o limite de armazenamento de GB para KB
        const storageLimitInKB = 5 * 1024 * 1024; // Plano free como padrão em KB

        setAnimatedData((prevData) => ({
          ...prevData,
          storageLimit: storageLimitInKB,
          planName: data.plan || 'Plano Free',
          isPlanCanceled: data.isCanceled,
          daysUntilExpiration: data.daysUntilExpiration,
        }));
      } catch (error) {
        console.error('Failed to fetch plan info:', error);
      } finally {
        setPlanLoading(false);
      }
    }

    fetchDashboardData();
    fetchPlanInfo();
  }, []);

  // Calcula a porcentagem usada, sempre comparando KB com KB
  const storagePercentage = Math.min(
    (animatedData.totalStorageUsed.size / animatedData.storageLimit) * 100,
    100
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Painel de informações</h1>

      {/* Alerta usando o componente separado */}
      <DashboardAlerts
        isPlanCanceled={animatedData.isPlanCanceled}
        daysUntilExpiration={animatedData.daysUntilExpiration}
        storagePercentage={storagePercentage}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {loading ? (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        ) : (
          <>
            <InfoCard
              title="Documentos Cadastrados"
              value={animatedData.totalDocuments.toString()}
              icon={<FileText size={25} className="text-gray-500" />}
              colorClass="text-primary"
            />
            <InfoCard
              title="Caixas Cadastradas"
              value={animatedData.totalContainers.toString()}
              icon={<Box size={25} className="text-gray-500" />}
              colorClass="text-primary"
            />
            <InfoCard
              title="Armazenamento ocupado"
              value={formatStorageSize(animatedData.totalStorageUsed.size)}
              icon={<Server size={25} className="text-gray-500" />}
              colorClass="text-primary"
            />
            <Card className="w-full">
              <CardHeader>
                <CardTitle>
                  Armazenamento do Plano ({planLoading ? 'Carregando...' : animatedData.planName})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {formatStorageSize(animatedData.totalStorageUsed.size)} /{' '}
                  {formatStorageSize(animatedData.storageLimit)}
                </p>
                <Progress value={storagePercentage} />
                <p className="text-xs mt-2">
                  {storagePercentage >= 100
                    ? 'Armazenamento cheio'
                    : `Usado ${storagePercentage.toFixed(2)}% do limite`}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Separator className="my-8" />
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        <div className="flex-1 mb-6 lg:mb-0">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Documentos por Caixa</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <DocumentBarChart data={dataBar} />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Documentos ao Longo do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <DocumentLineChart data={dataLine} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
