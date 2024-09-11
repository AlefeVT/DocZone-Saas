import { DocumentEditController } from '@/app/controller/document/DocumentEditController';
import { DocumentEditForm } from './_components/documentEditForm';

export default async function DocumentEditRoute({
  params,
}: {
  params: { id: string };
}) {
  const data = await DocumentEditController.getDocumentEditData(params.id);

  return <DocumentEditForm initialData={data} />;
}
