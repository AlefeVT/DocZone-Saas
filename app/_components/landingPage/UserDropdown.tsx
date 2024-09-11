"use client"

import { LogoutButton } from '@/components/auth/logout-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, FileText } from 'lucide-react'; // Importando ícones

interface iAppProps {
  email: string;
  name: string;
  userImage: string | undefined;
}

export function UserDropdown({ email, name, userImage }: iAppProps) {
  const handleManualClick = () => {
    window.open('/manual.pdf', '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userImage} alt="Imagem do Usuário" />
            <AvatarFallback>{name.slice(0, 3)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-xs leading-none text-muted-foreground">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutButton className='flex items-center w-full'>
            <LogOut className="mr-2 h-4 w-4" />
            Deslogar
          </LogoutButton>
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' onClick={handleManualClick}>
          <FileText className="mr-2 h-4 w-4" />
          Manual
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
