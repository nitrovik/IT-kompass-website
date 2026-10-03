import { cn } from "@/lib/utils";

export function Field({ label, name, type = "text", required = false, placeholder, defaultValue }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string }) {
  return <label className="grid gap-2 text-sm font-medium text-slate-200"><span>{label}{required ? <span className="text-[#6EC5FF]"> *</span> : null}</span><input className="h-12 rounded-xl border border-white/10 bg-white/[.03] px-4 text-white placeholder:text-slate-600" type={type} name={name} required={required} placeholder={placeholder} defaultValue={defaultValue} /></label>;
}

export function TextareaField({ label, name, required = false, placeholder, rows = 6 }: { label: string; name: string; required?: boolean; placeholder?: string; rows?: number }) {
  return <label className="grid gap-2 text-sm font-medium text-slate-200"><span>{label}{required ? <span className="text-[#6EC5FF]"> *</span> : null}</span><textarea className="min-h-[140px] rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-white placeholder:text-slate-600" name={name} required={required} placeholder={placeholder} rows={rows} /></label>;
}

export function SelectField({ label, name, options, required = false }: { label: string; name: string; options: string[]; required?: boolean }) {
  return <label className="grid gap-2 text-sm font-medium text-slate-200"><span>{label}{required ? <span className="text-[#6EC5FF]"> *</span> : null}</span><select className={cn("h-12 rounded-xl border border-white/10 bg-[#0b192a] px-4 text-white")} name={name} required={required} defaultValue=""><option value="" disabled>Velg</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}
