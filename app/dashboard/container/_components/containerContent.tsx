import { ContainerTable } from './containerTable';
import { ContainerTableSkeleton } from './containerTableSkeleton';

export function Content({
  loading,
  containers,
}: {
  loading: boolean;
  containers: ContainerData[];
}) {
  if (loading) {
    return <ContainerTableSkeleton />;
  } else {
    return <ContainerTable containers={containers} />;
  }
}
