'use server';

import * as z from 'zod';
import { RegisterSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/mail';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/utils';

const db = new PrismaClient();

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await hashPassword(password);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  // Criar o usuário no banco de dados
  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Criar uma assinatura padrão com o plano "free"
  await db.subscription.create({
    data: {
      userId: user.id,
      plan: 'free',
      period: 'monthly', // ou qualquer período que você deseja
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Definindo como 1 ano, ajuste conforme necessário
    },
  });

  const verificationToken = await generateVerificationToken(email);

  console.log(verificationToken);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'E-mail de confirmação enviado!' };
};
