import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Código de Autenticação em Duas Etapas',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Seu código de autenticação</h2>
        <p>Seu código de autenticação em duas etapas é <b style="font-size: 20px; color: #4CAF50;">${token}</b></p>
        <p>Utilize este código para acessar sua conta de forma segura.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: 'DocZone - Redefinição de Senha <onboarding@resend.dev>',
    to: email,
    subject: 'Redefinição de Senha',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Redefinição de Senha</h2>
        <p>Para redefinir sua senha, clique no link abaixo:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
        <p>Se você não solicitou uma redefinição de senha, por favor ignore este email.</p>
      </div>
    `,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: 'DocZone - Confirmação de Email <onboarding@resend.dev>',
    to: email,
    subject: 'Confirmação de Email',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Confirme seu Email</h2>
        <p>Para confirmar seu email, clique no link abaixo:</p>
        <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #28A745; text-decoration: none; border-radius: 5px;">Confirmar Email</a>
        <p>Se você não solicitou esta confirmação, por favor ignore este email.</p>
      </div>
    `,
  });
};
