'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function HeroSection() {
  const router = useRouter();

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const redirectToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/auth/register');
  };

  return (
    <section className="bg-gray-50  py-16 px-6 md:py-24 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="max-w-md space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Gerencie seus documentos com facilidade
        </h1>
        <p className="text-lg text-gray-800 text-muted-foreground">
          Nossa plataforma de gerenciamento de documentos em nuvem oferece
          ferramentas poderosas para organizar, arquivar e separar seus
          documentos com segurança.
        </p>
        <div className="flex gap-4">
          <Button onClick={redirectToLogin}>Experimente Agora</Button>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 hover:underline"
            onClick={scrollToFeatures}
          >
            Saiba Mais
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <Image
        src="/ilustração.png"
        width={500}
        height={400}
        alt="Hero Image"
        className="rounded-lg shadow-lg"
        style={{ aspectRatio: '500/400', objectFit: 'cover' }}
      />
    </section>
  );
}
