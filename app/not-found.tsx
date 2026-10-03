import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="hero-surface grid min-h-[70vh] place-items-center px-6 py-20">
      <div className="max-w-xl text-center">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-white text-brand shadow-card" aria-hidden="true"><Compass size={34} /></span>
        <p className="eyebrow mt-8">404 – feil retning</p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-[-.04em] text-ink sm:text-6xl">Du har tatt en annen vei.</h1>
        <p className="mt-5 leading-7 text-body">Siden du leter etter finnes ikke. Kompasset peker deg tilbake til forsiden.</p>
        <Link href="/" className={`${buttonVariants({ size: "lg" })} mt-8`}><ArrowLeft size={17} aria-hidden="true" /> Til forsiden</Link>
      </div>
    </main>
  );
}
