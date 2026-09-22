import { Suspense } from "react";
import GovHeroBanner from "@/components/GovHeroBanner";
import HeroReportsPanel from "@/components/HeroReportsPanel";
import LiveGridSection from "@/components/LiveGridSection";
import BrowseByRegion from "@/components/BrowseByRegion";
import QuickLinksGrid from "@/components/QuickLinksGrid";
import SeoContent from "@/components/SeoContent";
import FaqAccordion from "@/components/FaqAccordion";

export default function Home() {
  return (
    <div>
      <GovHeroBanner />

      <div className="relative z-10 mx-auto -mt-12 max-w-6xl px-4 sm:px-6">
        <QuickLinksGrid />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Suspense
          fallback={
            <div className="h-48 animate-pulse rounded-2xl bg-white ring-1 ring-zinc-200" />
          }
        >
          <HeroReportsPanel />
        </Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Suspense
          fallback={
            <div className="h-[420px] animate-pulse rounded-2xl bg-white ring-1 ring-zinc-200" />
          }
        >
          <LiveGridSection />
        </Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Suspense
          fallback={
            <div className="h-72 animate-pulse rounded-2xl bg-white ring-1 ring-zinc-200" />
          }
        >
          <BrowseByRegion />
        </Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SeoContent />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <FaqAccordion />
      </section>
    </div>
  );
}
