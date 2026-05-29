import NavbarLanding from "../components/NavbarLanding";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";
import Footer from "../components/Footer";

import MobileLanding from "./MobileLanding";

export default function Landing() {
  return (
    <>
  {/* MOBILE */}
  <div className="block md:hidden">
    <MobileLanding />
  </div>

  {/* DESKTOP */}
  <div className="hidden md:block">
    <NavbarLanding />
    <Hero />
    <Features />
    <Stats />
    <Footer />
  </div>
</>
  );
}