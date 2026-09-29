import { BuildingSection } from "@/components/building";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { IntroProvider } from "@/components/intro";
import { ActivityAndStatus, Approvals, ElevatorBoard } from "@/components/sections";

export default function Home() {
  return (
    <IntroProvider>
      <Header />
      <main>
        <Hero />
        <BuildingSection />
        <Approvals />
        <ElevatorBoard />
        <ActivityAndStatus />
      </main>
      <Footer />
    </IntroProvider>
  );
}
