"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { config } from '@/app/service/stripe/config';

export type PlanType = 'basic' | 'intermediate' | 'advanced' | 'professional';

const plans = Object.entries(config.stripe.plans).map(([key, plan]) => ({
    id: key,
    name: plan.name,
    description: plan.description,
    priceMonthly: plan.priceMonthly,
    priceYearly: plan.priceYearly,
    priceMonthlyId: plan.priceMonthlyId,
    priceYearlyId: plan.priceYearlyId,
    quota: plan.quota,
    planType: key as PlanType,
}));

export default function PlansView({ user }: any) {
    const [loading, setLoading] = useState(false);

    const userData = JSON.parse(user.value); // Converte a string JSON em um objeto

    const handleCheckout = async (planType: PlanType) => {
        try {
            setLoading(true);

            if (!userData) throw new Error('Usuário não encontrado.');

            const response = await fetch('/api/stripe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData.id,
                    userEmail: userData.email,
                    planType: planType,
                }),
            });

            const sessionResponse = await response.json();

            if (sessionResponse.url) {
                window.location.href = sessionResponse.url;
            } else {
                throw new Error('Falha ao criar a sessão de checkout.');
            }
        } catch (error) {
            console.error('Erro ao iniciar o checkout:', error);
            alert((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Escolha o seu plano</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {plans.map((plan) => (
                    <Card key={plan.id} className="shadow-lg">
                        <CardHeader>
                            <h2 className="text-xl font-semibold text-center">{plan.name}</h2>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p>{plan.description}</p>
                            <p className="font-semibold text-lg mt-4">Preço mensal: {plan.priceMonthly}</p>
                            <p className="text-sm text-gray-500">Preço anual: {plan.priceYearly}</p>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Button
                                onClick={() => handleCheckout(plan.planType)}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? 'Processando...' : 'Assinar'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
