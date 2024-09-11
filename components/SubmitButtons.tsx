'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface buttonProps {
  text?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
    | undefined;
  isLoading?: boolean;
}

export function SubmitButton({ text, variant, isLoading }: buttonProps) {
  return (
    <>
      {isLoading ? (
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Por favor, aguarde
        </Button>
      ) : (
        <Button variant={variant} type="submit">
          {text}
        </Button>
      )}
    </>
  );
}

export function DeleteItem({ isLoading }: buttonProps) {
  return (
    <>
      {isLoading ? (
        <Button disabled variant={'destructive'}>
          Removendo...
        </Button>
      ) : (
        <Button type="submit" variant={'destructive'}>
          Remover
        </Button>
      )}
    </>
  );
}
