export const config = {
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET || '',
    plans: {
      basic: {
        priceMonthlyId: 'price_1PxvTqGB21J15YuC8OaxhMbV',
        priceYearlyId: 'price_1PxvVbGB21J15YuCQctM7L5C',
        name: 'Plano Básico - 50 GB',
        description:
          'Ideal para pequenos negócios que precisam armazenar um volume moderado de documentos.',
        priceMonthly: 'R$29,90',
        priceYearly: 'R$299,00/ano',
        quota: {
          STORAGE: '50 GB',
        },
      },
      intermediate: {
        priceMonthlyId: 'price_1PxvSXGB21J15YuCdOlwaQJ2',
        priceYearlyId: 'price_1PxvW0GB21J15YuCDCMiFF8o',
        name: 'Plano Intermediário - 100 GB',
        description:
          'Perfeito para empresas de médio porte com um volume maior de documentos.',
        priceMonthly: 'R$49,90',
        priceYearly: 'R$499,00/ano',
        quota: {
          STORAGE: '100 GB',
        },
      },
      advanced: {
        priceMonthlyId: 'price_1PxvVAGB21J15YuCObJgmSlP',
        priceYearlyId: 'price_1PxvWMGB21J15YuCxYKVZHjk',
        name: 'Plano Avançado - 150 GB',
        description:
          'Indicado para negócios que precisam de um armazenamento significativo para gerenciamento de documentos.',
        priceMonthly: 'R$69,90',
        priceYearly: 'R$699,00/ano',
        quota: {
          STORAGE: '150 GB',
        },
      },
      professional: {
        priceMonthlyId: 'price_1PxvY1GB21J15YuCNVZRw5yT',
        priceYearlyId: 'price_1PxvYJGB21J15YuCzY8DwBf2',
        name: 'Plano Profissional - 200 GB',
        description:
          'Ideal para grandes empresas ou instituições públicas com alta demanda de armazenamento.',
        priceMonthly: 'R$89,90',
        priceYearly: 'R$899,00/ano',
        quota: {
          STORAGE: '200 GB',
        },
      },
    },
  },
};
