import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const labelClass = "grid gap-1.5 text-[13px] font-bold text-[#38536f]";

function LabelText({ label, required }: { label: string; required?: boolean }) {
  return (
    <span>
      {label}
      {required ? <span className="text-brand" aria-hidden="true"> *</span> : <span className="font-medium text-muted"> (valgfritt)</span>}
    </span>
  );
}

export function Field({ label, name, type = "text", required = false, placeholder, defaultValue, autoComplete, className }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string; autoComplete?: string; className?: string }) {
  return (
    <label className={cn(labelClass, className)}>
      <LabelText label={label} required={required} />
      <input className="form-control h-12" type={type} name={name} required={required} placeholder={placeholder} defaultValue={defaultValue} autoComplete={autoComplete} />
    </label>
  );
}

export function TextareaField({ label, name, required = false, placeholder, rows = 5 }: { label: string; name: string; required?: boolean; placeholder?: string; rows?: number }) {
  return (
    <label className={labelClass}>
      <LabelText label={label} required={required} />
      <textarea className="form-control min-h-[130px] resize-y" name={name} required={required} placeholder={placeholder} rows={rows} />
    </label>
  );
}

export function SelectField({ label, name, options, required = false, placeholder = "Velg" }: { label: string; name: string; options: readonly string[]; required?: boolean; placeholder?: string }) {
  return (
    <label className={labelClass}>
      <LabelText label={label} required={required} />
      <select className="form-control h-12" name={name} required={required} defaultValue="">
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

/* Usynlig felt som fanger opp roboter. Skjult for skjermlesere og tastatur. */
export function Honeypot() {
  return (
    <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
      <label>Nettsted<input name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
  );
}

export function FormMessage({ ok, children }: { ok: boolean; children: ReactNode }) {
  return <p role="status" className={cn("rounded-xl px-4 py-3 text-sm font-medium", ok ? "bg-[#e7f6ee] text-success" : "bg-[#fdeceb] text-danger")}>{children}</p>;
}
