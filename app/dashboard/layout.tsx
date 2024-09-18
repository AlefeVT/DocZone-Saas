import { ReactNode } from 'react';
import { DashboardNavigation } from '../_components/dashboard/DashboardNavigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserDropdown } from '../_components/landingPage/UserDropdown';
import { currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="flex w-full flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b z-10 bg-white">
        <nav className="hidden font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <DashboardNavigation />
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="shrink-0 md:hidden"
              variant={'outline'}
              size={'icon'}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side={'left'}>
            <nav className="flex flex-col gap-6 text-lg font-medium mt-5">
              <DashboardNavigation />
            </nav>
          </SheetContent>
        </Sheet>

        <UserDropdown
          email={user.email as string}
          name={user.name as string}
          userImage={user.image ?? `https://avatar.vercel.sh/${user.name}`}
        />
      </header>

      <main className="my-5">{children}</main>
    </div>
  );
}
