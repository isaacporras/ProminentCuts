import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Gallery } from "@/components/sections/Gallery";
import { Appointments } from "@/components/sections/Appointments";
import { Location } from "@/components/sections/Location";
import { Providers } from "@/components/sections/Providers";
import { Contact } from "@/components/sections/Contact";

// Providers/Services read the database on every request (editable from
// /admin) — this page can't be statically prerendered at build time.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Gallery />
        <Appointments />
        <Location />
        <Providers />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
