import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return <main id="main" className="grid min-h-screen place-items-center px-6 pt-24"><div className="max-w-xl text-center"><div className="mx-auto grid size-20 place-items-center rounded-full border border-[#269BFF]/30 bg-[#269BFF]/10 text-[#6EC5FF]"><Compass size={32}/></div><div className="eyebrow mt-8">404 / feil retning</div><h1 className="mt-5 text-5xl font-semibold tracking-[-.06em] sm:text-6xl">Du har tatt en annen vei.</h1><p className="mt-5 leading-7 text-slate-400">Siden du leter etter finnes ikke her. Kompasset peker tilbake til forsiden.</p><Link href="/" className={`${buttonVariants({ size: "lg" })} mt-8`}><ArrowLeft size={17}/> Til forsiden</Link></div></main>;
}
