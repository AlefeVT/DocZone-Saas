import {
  AccessibilityIcon,
  LockIcon,
  PowerIcon,
  ScalingIcon,
} from 'lucide-react';

export function BenefitsSection() {
  return (
    <section id="benefits" className="bg-muted py-16 px-6 md:py-24 md:px-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Benefícios da Plataforma</h2>
          <p className="text-muted-foreground">
            Descubra como nossa plataforma pode melhorar sua produtividade.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BenefitItem
            icon={<PowerIcon className="h-12 w-12 text-primary" />}
            title="Aumento da Produtividade"
            description="Melhore a eficiência organizando seus documentos de maneira inteligente e acessível em tempo real."
          />
          <BenefitItem
            icon={<AccessibilityIcon className="h-12 w-12 text-primary" />}
            title="Acesso Remoto"
            description="Acesse seus documentos de qualquer lugar, a qualquer momento, em qualquer dispositivo."
          />
          <BenefitItem
            icon={<ScalingIcon className="h-12 w-12 text-primary" />}
            title="Escalabilidade"
            description="Nossa plataforma é projetada para crescer junto com sua empresa."
          />
          <BenefitItem
            icon={<LockIcon className="h-12 w-12 text-primary" />}
            title="Segurança"
            description="Seus dados estão seguros com nossos recursos avançados de criptografia e backup."
          />
        </div>
      </div>
    </section>
  );
}

function BenefitItem({ icon, title, description }: any) {
  return (
    <div className="flex items-start gap-4">
      {icon}
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
