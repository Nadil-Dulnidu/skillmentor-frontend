import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: ReactNode }) {
  return (
      <>
      <section className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </section>
      <Toaster/>
      </>
  );
}
