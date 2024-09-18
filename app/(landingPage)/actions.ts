'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function sendContactEmail(
  name: string,
  email: string,
  message: string
) {
  try {
    await resend.emails.send({
      from: 'DocZone - Novo Contato <onboarding@resend.dev>',
      to: ['alefevt@gmail.com'],
      subject: `Contato de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4169E1; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px; color: white; text-align: center;">
            <h2 style="margin: 0;">Novo Contato Recebido</h2>
          </div>
          <div style="padding: 20px; background-color: #ffffff; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="font-size: 16px; margin-bottom: 10px;"><strong>Nome:</strong> ${name}</p>
            <p style="font-size: 16px; margin-bottom: 10px;"><strong>Email:</strong> ${email}</p>
            <p style="font-size: 16px; margin-bottom: 10px;"><strong>Mensagem:</strong></p>
            <p style="font-size: 14px; color: #333; background-color: #f9f9f9; padding: 10px; border-left: 4px solid #4169E1;">${message}</p>
          </div>
          <div style="padding: 10px; text-align: center; font-size: 12px; color: #999;">
            <p>DocZone - Sistema de Gerenciamento de Documentos</p>
          </div>
        </div>
      `,
    });

    return { success: true, message: 'Email enviado com sucesso!' };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error: 'Erro ao enviar email' };
  }
}
