'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { sendContactEmail } from '../actions';
import { toast } from 'sonner';
import { contactFormSchema } from '@/schemas';
import { CheckCircle, XCircle } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [id]: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validation = contactFormSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });

      setErrors((prev) => ({
        ...prev,
        ...fieldErrors,
      }));

      setLoading(false);
      return;
    }

    try {
      const response = await sendContactEmail(
        formData.name,
        formData.email,
        formData.message
      );
      if (response.success) {
        toast('Email enviado com sucesso!', {
          description:
            'Obrigado por entrar em contato. Responderemos em breve.',
          icon: <CheckCircle className="text-green-500" />,
        });
        setFormData({ name: '', email: '', message: '' });
        setErrors({ name: '', email: '', message: '' });
      } else {
        toast('Erro ao enviar o e-mail.', {
          description: response.error || 'Tente novamente.',
          icon: <XCircle className="text-red-500" />,
        });
      }
    } catch (err) {
      toast('Ocorreu um erro ao enviar o formulário.', {
        description: 'Por favor, tente novamente mais tarde.',
        icon: <XCircle className="text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-16 px-4 md:py-24 md:px-8 lg:px-16 bg-gray-50"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Entre em Contato
          </h2>
          <p className="text-lg text-gray-600">
            Preencha o formulário abaixo e entraremos em contato com você.
          </p>
        </div>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          onSubmit={handleSubmit}
        >
          <div className="space-y-3">
            <Label htmlFor="name" className="text-lg font-medium text-gray-700">
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              value={formData.name}
              onChange={handleChange}
              className={`border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 ${errors.name ? 'border-red-500' : ''}`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="email"
              className="text-lg font-medium text-gray-700"
            >
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={formData.email}
              onChange={handleChange}
              className={`border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 ${errors.email ? 'border-red-500' : ''}`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="space-y-3 md:col-span-2">
            <Label
              htmlFor="message"
              className="text-lg font-medium text-gray-700"
            >
              Mensagem
            </Label>
            <Textarea
              id="message"
              placeholder="Digite sua mensagem"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className={`border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 ${errors.message ? 'border-red-500' : ''}`}
              required
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}
          </div>
          <div className="md:col-span-2 text-center">
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
