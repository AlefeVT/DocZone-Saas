'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { Loader } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleRedirect = async () => {
      const stripePaymentLink = localStorage.getItem('stripePaymentLink');
      const user = await currentUser();

      if (stripePaymentLink && user) {
        localStorage.removeItem('stripePaymentLink');
        router.push(`${stripePaymentLink}?prefilled_email=${user.email}`);
      } else {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-sm shadow-lg">
          <CardContent className="flex flex-col items-center p-6 space-y-4">
            <Loader className="w-10 h-10 text-primary animate-spin" />
            <p className="text-lg font-medium text-gray-700">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
