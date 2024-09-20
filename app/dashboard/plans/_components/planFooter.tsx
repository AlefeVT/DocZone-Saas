import Link from 'next/link';

export default function PlanFooter() {
  return (
    <footer className="text-center mt-8">
      <p className="text-sm text-gray-500">
        Precisa de ajuda?{' '}
        <Link href="/support" className="text-indigo-600 underline">
          Entre em contato com o suporte
        </Link>
        .
      </p>
    </footer>
  );
}
