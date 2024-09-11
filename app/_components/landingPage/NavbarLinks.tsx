'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const navbarLinks = [
  {
    id: 0,
    name: 'Inicio',
    href: '/',
  },
  {
    id: 1,
    name: 'Produtos',
    href: '/products/all',
  },
  {
    id: 2,
    name: 'Masculino',
    href: '/products/men',
  },
  {
    id: 3,
    name: 'Feminino',
    href: '/products/women',
  },
  {
    id: 4,
    name: 'Infantil',
    href: '/products/infantil',
  },
];

export function NavbarLinks({ role }: any) {
  const location = usePathname();

  // Adiciona o link para Dashboard se o usuário for admin
  const links = [...navbarLinks];
  if (role === 'ADMIN') {
    links.push({
      id: 5,
      name: 'Dashboard',
      href: '/dashboard',
    });
  }

  return (
    <div className="hidden md:flex justify-center items-center gap-x-2 ml-8">
      {links.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={cn(
            location === item.href
              ? 'bg-muted'
              : 'hover:bg-muted hover:bg-opacity-75',
            'group p-2 font-medium rounded-md'
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
