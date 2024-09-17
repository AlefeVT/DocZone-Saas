import { stripe } from "@/lib/stripe";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const prisma = new PrismaClient();

    console.log("CAIUUU");

    const sig = req.headers.get("stripe-signature")!;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);

    } catch (err: any) {
        console.error("Webhook signature verification failed.", err.message);
        return new Response(`Webhook Error: ${err.message}`, {
            status: 400,
        });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
                console.log("checkout.session.completed recebido");

                const session = await stripe.checkout.sessions.retrieve(
                    (event.data.object as Stripe.Checkout.Session).id,
                    {
                        expand: ["line_items"],
                    }
                );
                const customerId = session.customer as string;
                const customerDetails = session.customer_details;

                if (customerDetails?.email) {


                    const user = await prisma.user.findUnique({
                        where: { email: customerDetails.email },
                    });
                    if (!user) throw new Error("Usuário não encontrado!");

                    if (!user.customerId) {
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { customerId },
                        });
                    }

                    const lineItems = session.line_items?.data || [];

                    console.log(session.line_items?.data);


                    for (const item of lineItems) {
                        const priceId = item.price?.id
                        const isSubscription = item.price?.type === "recurring";

                        if (isSubscription) {
                            let endDate = new Date();
                            if (priceId === process.env.STRIPE_YEARLY_BASIC_PRICE_ID!) {
                                endDate.setFullYear(endDate.getFullYear() + 1)
                            } else if (priceId === process.env.STRIPE_MONTHLY_BASIC_PRICE_ID!) {
                                endDate.setMonth(endDate.getMonth() + 1);
                            } else {
                                throw new Error("Preço do plano inválido!");
                            }
                            try {
                                await prisma.subscription.upsert({
                                    where: { userId: user.id! },
                                    create: {
                                        userId: user.id,
                                        startDate: new Date(),
                                        endDate: endDate,
                                        plan: "basic",
                                        period: priceId === process.env.STRIPE_YEARLY_BASIC_PRICE_ID! ? "yearly" : "monthly",
                                    },
                                    update: {
                                        plan: "basic",
                                        period: priceId === process.env.STRIPE_YEARLY_BASIC_PRICE_ID! ? "yearly" : "monthly",
                                        startDate: new Date(),
                                        endDate: endDate,
                                    },
                                })
                            } catch (dbError) {
                                console.error("Erro no banco de dados:", dbError);
                            }

                        } else {

                        }
                    }
                }
                break;

            default:
                console.log(`tipo de evento não tratado ${event.type}`);
        }
    } catch (err: any) {
        console.error("Erro ao processar webhook:", err);
        return new Response(`Webhook Error: ${err.message}`, {
            status: 400,
        });
    }

    return new Response("Webhook recebido com sucesso", {
        status: 200,
    });

}