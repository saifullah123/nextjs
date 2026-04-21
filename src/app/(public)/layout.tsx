import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromoBar from '@/components/PromoBar';
import { BackgroundAnimation } from "@/components/BackgroundAnimation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackgroundAnimation />
      <div className="relative z-10 min-h-screen flex flex-col">
        <PromoBar />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
