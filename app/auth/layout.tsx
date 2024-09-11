import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-x-4 ml-8 mt-8">
        <Button variant={'outline'} size={'icon'} asChild>
          <Link href={'/'}>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">Voltar</h1>
      </div>

      <div className="flex-grow flex justify-center items-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
