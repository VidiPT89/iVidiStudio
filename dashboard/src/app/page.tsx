import { BuildingSection } from "@/components/building";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { IntroProvider } from "@/components/intro";
import { LiveProvider } from "@/components/live";
import { ActivityAndStatus, Approvals, ElevatorBoard } from "@/components/sections";

export default function Home() {
  return (
    <IntroProvider>
      <LiveProvider>
        <Header />
        <main>
          <Hero />
          <BuildingSection />
          <Approvals />
          <ElevatorBoard />
          <ActivityAndStatus />
        </main>
        <Footer />
      </LiveProvider>
    </IntroProvider>
  );
}
