import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Appointments } from "@/components/sections/Appointments";
import { Location } from "@/components/sections/Location";
import { Providers } from "@/components/sections/Providers";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Appointments />
        <Location />
        <Providers />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
