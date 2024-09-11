'use client';

import { useCurrentRole } from '@/hooks/auth/use-current-role';
import { FormError } from '@/components/form-error';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole?: string;
  allowedRoles?: string[];
}

export const RoleGate = ({ children, allowedRoles }: RoleGateProps) => {
  const role = useCurrentRole();

  if (allowedRoles && allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return null;
};

export const RoleGateLayout = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message="Você não tem permissão para visualizar este conteúdo!" />
    );
  }

  return <>{children}</>;
};
