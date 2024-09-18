'use client';

import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

type PaymentLinkProps = {
  href: string;
  paymentLink?: string;
  text: string;
};

const PaymentLink = ({ href, paymentLink, text }: PaymentLinkProps) => {
  return (
    <Link
      href={href}
      className={buttonVariants()}
      onClick={() => {
        if (paymentLink) {
          localStorage.setItem('stripePaymentLink', paymentLink);
        }
      }}
    >
      {text}
    </Link>
  );
};
export default PaymentLink;
