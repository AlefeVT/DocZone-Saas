import { Button } from '@/components/ui/button';
import { RefreshCw, SquareUserRound } from 'lucide-react';
import Link from 'next/link';

interface PlanActionsProps {
    onRefresh: () => void;
}

export default function PlanActions({ onRefresh }: PlanActionsProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full mt-6">

            <Button variant="outline" onClick={onRefresh} className="flex justify-center w-full sm:w-auto items-center px-4 py-3">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar Dados
            </Button>

            <Link href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL || '#'}>
                <Button variant="outline" className="flex justify-center w-full sm:w-auto px-6 py-3">
                    <SquareUserRound className="mr-2" />
                    Portal do Cliente
                </Button>
            </Link>

        </div>
    );
}
