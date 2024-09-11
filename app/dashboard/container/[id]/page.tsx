import ContainerEditForm from './_components/containerEditForm';
import getContainerEdit from './actions';

export default async function DocumentEditRoute({
  params,
}: {
  params: { id: string };
}) {
  const data = await getContainerEdit(params.id);

  return <ContainerEditForm data={data} />;
}
