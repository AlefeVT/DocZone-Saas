'use client';

import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function PlansView() {
  return (
    <div className="min-h-screenflex flex-col items-center justify-center px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Gerenciar Assinatura
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Acesse o portal do cliente para alterar seu plano ou cancelar sua
          assinatura.
        </p>
      </header>

      <div className="flex justify-center">
        <Link
          rel="noreferrer noopener"
          href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL!}
          target="_blank"
          className={`text-[17px] ${buttonVariants({
            variant: 'default',
          })} px-6 py-3`}
        >
          Portal do Cliente
        </Link>
      </div>

      <footer className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Precisa de ajuda?{' '}
          <a href="/support" className="text-indigo-600 underline">
            Entre em contato com o suporte
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
