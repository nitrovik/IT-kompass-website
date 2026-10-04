import { homeProcess } from "@/content/home";
import { SectionHeading } from "@/components/site/section-heading";
import { ProcessTrack } from "@/components/home/process-track";

export function ProcessSection() {
  return (
    <section className="section-pad" aria-labelledby="prosess-heading">
      <div className="container-shell">
        <SectionHeading id="prosess-heading" eyebrow={homeProcess.eyebrow} title={homeProcess.title} body={homeProcess.body} />
        <ProcessTrack steps={homeProcess.steps} />
      </div>
    </section>
  );
}
