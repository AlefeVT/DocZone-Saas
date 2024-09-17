"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import PaymentLink from "./PaymentLink";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  priceMonthly?: number;
  priceYearly?: number;
  description: string;
  benefitList: string[];
  paymentLinkMonthly?: string;
  paymentLinkYearly?: string;
}

const pricingList: PricingProps[] = [
  {
    title: "Plano Gratuito",
    popular: PopularPlanType.NO,
    description: "Ideal para quem está começando",
    benefitList: ["5 GB de armazenamento", "Suporte limitado"],
  },
  {
    title: "Plano Básico",
    popular: PopularPlanType.NO,
    priceMonthly: 29.9,
    priceYearly: 299.0,
    description: "Ideal para pequenos negócios",
    benefitList: ["50 GB de armazenamento", "Suporte básico", "Melhor preço!"],
    paymentLinkMonthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PLAN_BASIC_LINK!,
    paymentLinkYearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PLAN_BASIC_LINK!,
  },
  {
    title: "Plano Intermediário",
    popular: PopularPlanType.YES,
    priceMonthly: 49.9,
    priceYearly: 499.0,
    description: "Perfeito para empresas de médio porte",
    benefitList: ["100 GB de armazenamento", "Suporte prioritário", "Mais popular!"],
    paymentLinkMonthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PLAN_INTERMEDIARY_LINK!,
    paymentLinkYearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PLAN_INTERMEDIARY_LINK!,
  },
  {
    title: "Plano Avançado",
    popular: PopularPlanType.NO,
    priceMonthly: 69.9,
    priceYearly: 699.0,
    description: "Para grandes volumes de documentos",
    benefitList: ["150 GB de armazenamento", "Suporte premium", "Melhor valor!"],
    paymentLinkMonthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PLAN_ADVANCED_LINK!,
    paymentLinkYearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PLAN_ADVANCED_LINK!,
  },
  {
    title: "Plano Profissional",
    popular: PopularPlanType.NO,
    priceMonthly: 89.9,
    priceYearly: 899.0,
    description: "Ideal para grandes empresas",
    benefitList: ["200 GB de armazenamento", "Suporte completo", "Mais completo!"],
    paymentLinkMonthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PLAN_PROFESSIONAL_LINK!,
    paymentLinkYearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PLAN_PROFESSIONAL_LINK!,
  },
  {
    title: "Plano Personalizado",
    popular: PopularPlanType.NO,
    description: "Crie um plano sob medida para suas necessidades",
    benefitList: ["Armazenamento ilimitado", "Suporte VIP", "Gestão personalizada"],
    paymentLinkMonthly: "#",
    paymentLinkYearly: "#",
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="container my-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Escolha o{" "}
        <span className="bg-gradient-to-b from-[#5476f2] to-[#4b7ca2] uppercase text-transparent bg-clip-text">
          plano perfeito
        </span>{" "}
        para você
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Compare os planos e escolha o que melhor atende às suas necessidades.
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={
              pricing.popular === PopularPlanType.YES
                ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-2 border-primary"
                : "border-2 border-gray-200"
            }
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge variant="secondary" className="text-sm text-primary">
                    Mais popular
                  </Badge>
                ) : null}
              </CardTitle>
              <CardDescription>{pricing.description}</CardDescription>
              {pricing.priceMonthly && pricing.priceYearly ? (
                <div className="flex justify-around mt-4">
                  <div className="text-center">
                    <span className="text-3xl font-bold">R${pricing.priceMonthly}</span>
                    <span className="text-muted-foreground"> /mês</span>
                    <div className="mt-2">
                      <PaymentLink href="#" text="Escolher Mensal" paymentLink={pricing.paymentLinkMonthly} />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold">R${pricing.priceYearly}</span>
                    <span className="text-muted-foreground"> /ano</span>
                    <div className="mt-2">
                      <PaymentLink href="#" text="Escolher Anual" paymentLink={pricing.paymentLinkYearly} />
                    </div>
                  </div>
                </div>
              ) : pricing.title === "Plano Gratuito" ? (
                <div className="text-center mt-4">
                  <span className="text-3xl font-bold">Gratuito</span>
                  <div className="mt-2">
                    <PaymentLink href="#" text="Começar agora" paymentLink="#" />
                  </div>
                </div>
              ) : (
                <div className="text-center mt-4">
                  <span className="text-3xl font-bold">Sob Consulta</span>
                  <div className="mt-2">
                    <PaymentLink href="#" text="Solicitar Orçamento" paymentLink="#" />
                  </div>
                </div>
              )}
            </CardHeader>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitList.map((benefit: string) => (
                  <span key={benefit} className="flex">
                    <Check className="text-purple-500" />
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
