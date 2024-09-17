import { ReactNode } from 'react';
import { Navbar } from '../_components/landingPage/Navbar';
import Footer from '../_components/landingPage/Footer';
import ClientComponent from '../dashboard/ClientComponent';

export default function StoreFrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <ClientComponent>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
      </ClientComponent>
      <Footer />
    </>

  );

}
