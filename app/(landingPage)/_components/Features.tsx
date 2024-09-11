import {
  DatabaseBackupIcon,
  FileText,
  LockIcon,
  Package,
  SearchIcon,
  UploadIcon,
} from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 px-6 md:py-24 md:px-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Principais Funcionalidades</h2>
          <p className="text-muted-foreground">
            Descubra como nossa plataforma pode simplificar seu fluxo de
            trabalho.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureItem
            icon={<UploadIcon className="h-12 w-12 text-primary" />}
            title="Upload de Arquivos"
            description="Faça upload de documentos de forma rápida e segura."
          />
          <FeatureItem
            icon={<SearchIcon className="h-12 w-12 text-primary" />}
            title="Pesquisa Avançada"
            description="Encontre seus arquivos rapidamente com nossa ferramenta de busca."
          />
          <FeatureItem
            icon={<LockIcon className="h-12 w-12 text-primary" />}
            title="Segurança"
            description="Seus dados estão seguros com nossos recursos de criptografia."
          />
          <FeatureItem
            icon={<DatabaseBackupIcon className="h-12 w-12 text-primary" />}
            title="Backup Automático"
            description="Nunca mais perca seus arquivos com nosso backup automático."
          />
          <FeatureItem
            icon={<FileText className="h-12 w-12 text-primary" />}
            title="Suporte a Múltiplos Formatos"
            description="Gerencie e visualize documentos em diversos formatos, incluindo PDF, DOCX, XLSX, e mais."
          />
          <FeatureItem
            icon={<Package className="h-12 w-12 text-primary" />}
            title="Organização por Caixas"
            description="Crie e organize documentos em caixas personalizadas para fácil acesso."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ icon, title, description }: any) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {icon}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
