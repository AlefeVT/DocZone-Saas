import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlanInfoCardProps {
    planInfo: {
        plan: string;
        isCanceled: boolean;
        daysUntilExpiration: number | null;
        timeUntilExpiration: string | null;
        endDate: string | null;
    };
}

const plans = {
    basic: {
        name: 'Plano Básico - 50 GB',
        description:
            'Ideal para pequenos negócios que precisam armazenar um volume moderado de documentos.',
        priceMonthly: 'R$29,90',
        priceYearly: 'R$299,00/ano',
    },
    intermediate: {
        name: 'Plano Intermediário - 100 GB',
        description:
            'Perfeito para empresas de médio porte com um volume maior de documentos.',
        priceMonthly: 'R$49,90',
        priceYearly: 'R$499,00/ano',
    },
    advanced: {
        name: 'Plano Avançado - 150 GB',
        description:
            'Indicado para negócios que precisam de um armazenamento significativo para gerenciamento de documentos.',
        priceMonthly: 'R$69,90',
        priceYearly: 'R$699,00/ano',
    },
    professional: {
        name: 'Plano Profissional - 200 GB',
        description:
            'Ideal para grandes empresas ou instituições públicas com alta demanda de armazenamento.',
        priceMonthly: 'R$89,90',
        priceYearly: 'R$899,00/ano',
    },
    free: {
        name: 'Plano Gratuito - 5 GB',
        description: 'Plano básico para usuários com baixa demanda de armazenamento.',
        priceMonthly: 'Grátis',
        priceYearly: 'Grátis',
    }
};

export default function PlanInfoCard({ planInfo }: PlanInfoCardProps) {
    const planKey = planInfo.plan.toLowerCase() as keyof typeof plans;
    const planDetails = plans[planKey] || plans['free']; 

    const isFreePlan = planKey === 'free' || !planInfo.plan; 

    const expirationMessage = () => {
        const currentDate = new Date().getTime();
        const endDate = planInfo.endDate ? new Date(planInfo.endDate).getTime() : null;

        if (planInfo.isCanceled && planInfo.daysUntilExpiration) {
            return (
                <p className="text-sm md:text-base text-red-500">
                    Seu plano foi cancelado. Ele será alterado para o plano <Badge variant={'default'} className="bg-red-100 text-red-600 hover:bg-red-50">Grátis</Badge> em {planInfo.daysUntilExpiration} dias.
                </p>
            );
        }

        if (planInfo.timeUntilExpiration && endDate && endDate > currentDate) {
            return (
                <p className="text-sm md:text-base text-yellow-500">
                    Sua assinatura expira em {planInfo.timeUntilExpiration}.
                </p>
            );
        }

        if (endDate && endDate <= currentDate) {
            return (
                <p className="text-sm md:text-base text-red-500">
                    Sua assinatura já expirou.
                </p>
            );
        }

        if (planInfo.endDate && endDate && endDate > currentDate) {
            return (
                <p className="text-sm md:text-base text-gray-700">
                    Sua assinatura expira em <span className="font-semibold">{new Date(planInfo.endDate as string).toLocaleDateString()}</span>.
                </p>
            );
        }

        return null;
    };

    return (
        <>
            <Card className="mb-6 w-full border rounded-lg shadow-lg">
                <CardHeader className="border-b pb-4">
                    <CardTitle className="text-xl font-bold text-primary">Informações do Plano</CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-medium text-gray-700">
                                Plano atual:
                            </p>
                            <Badge variant={'default'} >
                                {planDetails.name}
                            </Badge>
                        </div>

                        <p className="text-sm text-gray-500">{planDetails.description}</p>

                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
                            <p className="text-base md:text-lg text-gray-700">
                                <span className="font-semibold">Mensal:</span> {planDetails.priceMonthly}
                            </p>
                            <p className="text-base md:text-lg text-gray-700">
                                <span className="font-semibold">Anual:</span> {planDetails.priceYearly}
                            </p>
                        </div>

                        {!isFreePlan && expirationMessage()}
                    </div>
                </CardContent>
            </Card>

            {/* Alert Section */}
            {!isFreePlan && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mt-4" role="alert">
                    <strong className="font-bold">Atenção:</strong>
                    <span className="block sm:inline"> Quando o plano for alterado para o plano gratuito, todos os documentos armazenados serão bloqueados e posteriormente removidos do servidor.</span>
                </div>
            )}
        </>
    );
}
