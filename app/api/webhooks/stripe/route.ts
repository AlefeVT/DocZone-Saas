import { stripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const prisma = new PrismaClient();

  const WEBHOOK_SECRET = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!;

  const sig = req.headers.get('stripe-signature')!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return new Response(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = await stripe.checkout.sessions.retrieve(
          (event.data.object as Stripe.Checkout.Session).id,
          {
            expand: ['line_items'],
          }
        );
        const customerId = session.customer as string;
        const customerDetails = session.customer_details;

        if (customerDetails?.email) {
          const user = await prisma.user.findUnique({
            where: { email: customerDetails.email },
          });

          if (!user) throw new Error('Usuário não encontrado!');

          if (!user.customerId) {
            await prisma.user.update({
              where: { id: user.id },
              data: { customerId },
            });
          }

          const lineItems = session.line_items?.data || [];

          for (const item of lineItems) {
            const priceId = item.price?.id;
            const isSubscription = item.price?.type === 'recurring';

            if (isSubscription && priceId) {
              const endDate = new Date();
              let plan = '';

              if (
                priceId === process.env.STRIPE_YEARLY_BASIC_PRICE_ID ||
                priceId === process.env.STRIPE_MONTHLY_BASIC_PRICE_ID
              ) {
                plan = 'basic';
              } else if (
                priceId === process.env.STRIPE_YEARLY_INTERMEDIATE_PRICE_ID ||
                priceId === process.env.STRIPE_MONTHLY_INTERMEDIATE_PRICE_ID
              ) {
                plan = 'intermediate';
              } else if (
                priceId === process.env.STRIPE_YEARLY_ADVANCED_PRICE_ID ||
                priceId === process.env.STRIPE_MONTHLY_ADVANCED_PRICE_ID
              ) {
                plan = 'advanced';
              } else if (
                priceId === process.env.STRIPE_YEARLY_PROFESSIONAL_PRICE_ID ||
                priceId === process.env.STRIPE_MONTHLY_PROFESSIONAL_PRICE_ID
              ) {
                plan = 'professional';
              } else {
                throw new Error('Preço do plano inválido!');
              }

              if (priceId.includes('YEARLY')) {
                endDate.setFullYear(endDate.getFullYear() + 1);
              } else if (priceId.includes('MONTHLY')) {
                endDate.setMonth(endDate.getMonth() + 1);
              }

              await prisma.subscription.upsert({
                where: { userId: user.id },
                create: {
                  userId: user.id,
                  startDate: new Date(),
                  endDate,
                  plan,
                  period: priceId.includes('YEARLY') ? 'yearly' : 'monthly',
                },
                update: {
                  plan,
                  period: priceId.includes('YEARLY') ? 'yearly' : 'monthly',
                  startDate: new Date(),
                  endDate,
                },
              });
            }
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = await stripe.subscriptions.retrieve(
          (event.data.object as Stripe.Subscription).id
        );
        const user = await prisma.user.findUnique({
          where: { customerId: subscription.customer as string },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { plan: 'free' },
          });

          await prisma.subscription.update({
            where: { userId: user.id },
            data: {
              plan: 'free',
              endDate: new Date(),
            },
          });
        } else {
          console.error(
            'Usuário não encontrado na ação de deletar a assinatura!'
          );
          throw new Error(
            'Usuário não encontrado na ação de deletar a assinatura!'
          );
        }

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const user = await prisma.user.findUnique({
          where: { customerId },
        });

        if (user) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );
          const priceId = subscription.items.data[0].price.id;

          let newPlan = '';
          let period = '';

          if (
            priceId === process.env.STRIPE_YEARLY_BASIC_PRICE_ID ||
            priceId === process.env.STRIPE_MONTHLY_BASIC_PRICE_ID
          ) {
            newPlan = 'basic';
            period = priceId.includes('YEARLY') ? 'yearly' : 'monthly';
          } else if (
            priceId === process.env.STRIPE_YEARLY_INTERMEDIATE_PRICE_ID ||
            priceId === process.env.STRIPE_MONTHLY_INTERMEDIATE_PRICE_ID
          ) {
            newPlan = 'intermediate';
            period = priceId.includes('YEARLY') ? 'yearly' : 'monthly';
          } else if (
            priceId === process.env.STRIPE_YEARLY_ADVANCED_PRICE_ID ||
            priceId === process.env.STRIPE_MONTHLY_ADVANCED_PRICE_ID
          ) {
            newPlan = 'advanced';
            period = priceId.includes('YEARLY') ? 'yearly' : 'monthly';
          } else if (
            priceId === process.env.STRIPE_YEARLY_PROFESSIONAL_PRICE_ID ||
            priceId === process.env.STRIPE_MONTHLY_PROFESSIONAL_PRICE_ID
          ) {
            newPlan = 'professional';
            period = priceId.includes('YEARLY') ? 'yearly' : 'monthly';
          }

          const endDate = new Date();
          if (period === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
          } else {
            endDate.setMonth(endDate.getMonth() + 1);
          }

          await prisma.user.update({
            where: { id: user.id },
            data: { plan: newPlan },
          });

          await prisma.subscription.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              plan: newPlan,
              period,
              startDate: new Date(),
              endDate,
            },
            update: {
              plan: newPlan,
              period,
              startDate: new Date(),
              endDate,
            },
          });
        }

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await prisma.user.findUnique({
          where: { customerId: subscription.customer as string },
        });

        if (!user) {
          console.error('Usuário não encontrado na atualização de assinatura!');
          throw new Error(
            'Usuário não encontrado na atualização de assinatura!'
          );
        }

        let updatedPlan = '';
        let period = '';

        if (
          !subscription.items.data[0].price ||
          subscription.status === 'canceled' ||
          subscription.cancel_at_period_end
        ) {
          updatedPlan = 'free';
          period = 'monthly';
        } else {
          const priceId = subscription.items.data[0].price.id;
          if (
            priceId === process.env.STRIPE_YEARLY_BASIC_PRICE_ID ||
            priceId === process.env.STRIPE_MONTHLY_BASIC_PRICE_ID
          ) {
            updatedPlan = 'basic';
            period = priceId.includes('YEARLY') ? 'yearly' : 'monthly';
          } else if (
            priceId === process.env.STRIPE_YEARLY_INTERMEDIATE_PRICE_ID ||
            priceId === process.env.STRIPE_MONTHLY_INTERMEDIATE_PRICE_ID
          ) {
            updatedPlan = 'intermediate';
            period = priceId.includes('YEARLY') ? 'yearly' : 'monthly';
          } else if (
            priceId === process.env.STRIPE_YEARLY_ADVANCED_PRICE_ID ||
            priceId === process.env.STRIPE_MONTHLY_ADVANCED_PRICE_ID
          ) {
            updatedPlan = 'advanced';
            period = priceId.includes('YEARLY') ? 'yearly' : 'monthly';
          } else if (
            priceId === process.env.STRIPE_YEARLY_PROFESSIONAL_PRICE_ID ||
            priceId === process.env.STRIPE_MONTHLY_PROFESSIONAL_PRICE_ID
          ) {
            updatedPlan = 'professional';
            period = priceId.includes('YEARLY') ? 'yearly' : 'monthly';
          }
        }

        updatedPlan = updatedPlan || 'free';
        period = period || 'monthly';

        try {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: updatedPlan,
            },
          });

          await prisma.subscription.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              plan: updatedPlan,
              period: period,
              startDate: new Date(),
              endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            },
            update: {
              plan: updatedPlan,
              period: period,
              startDate: new Date(),
              endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            },
          });

          await prisma.subscription.findUnique({
            where: { userId: user.id },
          });

          // Verificando o estado final da subscription
          const finalSubscription = await prisma.subscription.findUnique({
            where: { userId: user.id },
          });
          if (!finalSubscription?.plan || !finalSubscription?.period) {
            console.error(
              `Erro: Campos vazios após o salvamento. Plan: ${finalSubscription?.plan}, Period: ${finalSubscription?.period}`
            );
          }
        } catch (error) {
          console.error('Erro ao atualizar o plano no Prisma:', error);
        }

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err: any) {
    console.error('Erro ao processar webhook:', err);
    return new Response(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  return new Response('Webhook recebido com sucesso', {
    status: 200,
  });
}
