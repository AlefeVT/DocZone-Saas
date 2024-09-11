import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 px-6 md:py-24 md:px-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">O que nossos clientes dizem</h2>
          <p className="text-muted-foreground">
            Veja como a DocZone tem transformado a gestão de documentos.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            name="João Dias"
            role="Gerente de Projetos"
            testimonial="A DocZone tem sido essencial para nossa empresa, permitindo uma organização eficiente e acesso rápido aos documentos. A interface é intuitiva e fácil de usar."
            avatarSrc="/placeholder-user.jpg"
            avatarFallback="JD"
          />
          <TestimonialCard
            name="Maria Silva"
            role="Analista de Negócios"
            testimonial="Desde que começamos a usar a DocZone, o gerenciamento de documentos se tornou muito mais prático. A segurança dos dados e a facilidade de busca são excepcionais."
            avatarSrc="/placeholder-user.jpg"
            avatarFallback="MS"
          />
          <TestimonialCard
            name="Ricardo Pereira"
            role="Diretor de TI"
            testimonial="A DocZone nos oferece uma solução centralizada e segura para gerenciar todos os nossos documentos. A tranquilidade de saber que tudo está bem organizado é incomparável."
            avatarSrc="/placeholder-user.jpg"
            avatarFallback="RP"
          />
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  name,
  role,
  testimonial,
  avatarSrc,
  avatarFallback,
}: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={avatarSrc} alt={`Avatar de ${name}`} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-lg font-semibold">{name}</h4>
            <p className="text-muted-foreground">{role}</p>
          </div>
        </div>
        <p className="mt-4 text-muted-foreground">{testimonial}</p>
      </CardContent>
    </Card>
  );
}
