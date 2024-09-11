import { Button } from '@/components/ui/button';

export default function Pricing() {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Planos de Preços
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border p-6 text-center rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Básico</h3>
            <p className="text-2xl font-bold mb-4">R$19/mês</p>
            <Button size="lg" variant={'default'}>
              Escolher Plano
            </Button>
          </div>
          <div className="border p-6 text-center rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Profissional</h3>
            <p className="text-2xl font-bold mb-4">R$49/mês</p>
            <Button size="lg" variant={'default'}>
              Escolher Plano
            </Button>
          </div>
          <div className="border p-6 text-center rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Empresarial</h3>
            <p className="text-2xl font-bold mb-4">R$99/mês</p>
            <Button size="lg" variant={'default'}>
              Escolher Plano
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
