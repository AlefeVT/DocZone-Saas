'use server';

import { currentUser } from '@/lib/auth';
import { containerSchema } from '@/schemas';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function createContainer(input: z.infer<typeof containerSchema>) {
  const prisma = new PrismaClient();
  const user = await currentUser();

  if (!user || !user.id) {
    redirect('/auth/login');
  }

  const validationResult = containerSchema.safeParse(input);

  if (!validationResult.success) {
    throw validationResult.error;
  }

  const container = await prisma.container.create({
    data: {
      name: input.name,
      description: input.description,
      userId: user.id,
      parentId: input.parentId || null,
    },
  });

  return container;
}
