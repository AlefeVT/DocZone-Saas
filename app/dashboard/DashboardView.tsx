'use client';

import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { FileText, Box, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoCard } from './_components/dashboardInfoCards';
import { DocumentBarChart } from './_components/DocumentBarChart';
import { DocumentLineChart } from './_components/DocumentLineChart';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardView() {
  const [loading, setLoading] = useState(true);
  const [animatedData, setAnimatedData] = useState({
    totalDocuments: 0,
    totalContainers: 0,
    totalStorageUsedSize: 0,
    totalStorageUsedUnit: '',
  });

  const [dataBar, setDataBar] = useState([]);
  const [dataLine, setDataLine] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();

        animateCountUp(
          data.totalDocuments,
          data.totalContainers,
          data.totalStorageUsed.size,
          data.totalStorageUsed.unit
        );

        setDataBar(data.documentsPerContainer);
        setDataLine(data.documentCreationOverTime);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false); // Definir loading como falso após o carregamento
      }
    }

    fetchDashboardData();
  }, []);

  const animateCountUp = (
    finalDocuments: number,
    finalContainers: number,
    finalStorageSize: number,
    finalStorageUnit: string
  ) => {
    const duration = 2000;
    const steps = 60;
    let currentDocuments = 0;
    let currentContainers = 0;
    let currentStorageSize = 0;

    const incrementDocuments = finalDocuments / steps;
    const incrementContainers = finalContainers / steps;
    const incrementStorageSize = finalStorageSize / steps;

    const interval = setInterval(() => {
      currentDocuments += incrementDocuments;
      currentContainers += incrementContainers;
      currentStorageSize += incrementStorageSize;

      setAnimatedData({
        totalDocuments: Math.min(Math.round(currentDocuments), finalDocuments),
        totalContainers: Math.min(
          Math.round(currentContainers),
          finalContainers
        ),
        totalStorageUsedSize: Math.min(
          parseFloat(currentStorageSize.toFixed(2)),
          finalStorageSize
        ),
        totalStorageUsedUnit: finalStorageUnit,
      });

      if (
        currentDocuments >= finalDocuments &&
        currentContainers >= finalContainers &&
        currentStorageSize >= finalStorageSize
      ) {
        clearInterval(interval);
      }
    }, duration / steps);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Painel de informações</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {loading ? (
          <>
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
              value={`${animatedData.totalStorageUsedSize} ${animatedData.totalStorageUsedUnit}`}
              icon={<Server size={25} className="text-gray-500" />}
              colorClass="text-primary"
            />
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
