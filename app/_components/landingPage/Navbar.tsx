import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import { UserDropdown } from './UserDropdown';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo/logo';

export async function Navbar() {
  const user = await currentUser();

  return (
    <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
      <div className="flex items-center">
        <Link href={'/'}>
          <Logo />
        </Link>
      </div>

      <div className="flex items-center">
        {user ? (
          <>
            <UserDropdown
              email={user.email as string}
              name={user.name as string}
              userImage={user.image ?? `https://avatar.vercel.sh/${user.name}`}
            />
          </>
        ) : (
          <div className="md:flex md:flex-1 md:items-center md:justify-end md:space-x-2">
            <Button variant={'ghost'} asChild>
              <Link href={'/auth/login'}>Conectar</Link>
            </Button>

            <Button variant={'ghost'} asChild>
              <Link href={'/auth/register'}>Rergistrar-se</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
