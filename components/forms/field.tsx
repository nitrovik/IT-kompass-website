"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

/*
  Skjemafeltene på nettsiden. Etiketten står alltid over feltet (plassholderen er bare en
  hjelp), og en feilmelding står rett under feltet den gjelder, koblet til med aria-describedby.
*/

type Common = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
};

function Label({ id, htmlFor, label, required, onClick }: { id?: string; htmlFor?: string; label: string; required?: boolean; onClick?: () => void }) {
  const content = (
    <>
      {label}
      {required ? <span className="form-req" aria-hidden="true">*</span> : <span className="form-optional">valgfritt</span>}
    </>
  );
  return htmlFor ? (
    <label className="form-label" id={id} htmlFor={htmlFor}>{content}</label>
  ) : (
    <span className="form-label" id={id} onClick={onClick}>{content}</span>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p className="form-error" id={id}>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 4.6v4.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11.1" r=".9" fill="currentColor" />
      </svg>
      {children}
    </p>
  );
}

export function TextField({ id, name, label, value, onChange, error, required, placeholder, type = "text", autoComplete, inputMode }: Common & { type?: string; autoComplete?: string; inputMode?: "email" | "tel" | "text" }) {
  return (
    <div className="form-field">
      <Label htmlFor={id} label={label} required={required} />
      <input
        id={id}
        name={name}
        type={type}
        className="form-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </div>
  );
}

export function TextAreaField({ id, name, label, value, onChange, error, required, placeholder, maxLength }: Common & { maxLength?: number }) {
  return (
    <div className="form-field">
      <Label htmlFor={id} label={label} required={required} />
      <textarea
        id={id}
        name={name}
        className="form-input"
        rows={5}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </div>
  );
}

/*
  Nedtrekksmeny etter WAI-ARIA-mønsteret «select-only combobox»:
  - Pil ned/opp, Enter eller mellomrom åpner. Pilene flytter, Home/End går til første/siste,
    Enter/mellomrom velger, Escape lukker uten å endre, Tab velger og går videre.
  - Å skrive bokstaver hopper til alternativet som begynner slik.
  - Skjermlesere får rollene combobox/listbox/option og hvilket alternativ som er aktivt.
  - Verdien sendes med skjemaet i et skjult felt med samme navn som før.
*/
export function SelectMenu({ id, name, label, value, onChange, error, required, placeholder = "Velg", options }: Common & { options: readonly string[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const selected = options.indexOf(value);
  const last = options.length - 1;

  const show = (index: number) => {
    setActive(Math.min(Math.max(index, 0), last));
    setOpen(true);
  };
  const commit = (index: number) => {
    if (index >= 0 && index <= last) onChange(options[index]);
    setOpen(false);
  };

  // Hopp til alternativet som begynner med det som skrives (samme bokstav flere ganger går videre)
  const search = (key: string) => {
    const now = Date.now();
    const state = typed.current;
    state.text = now - state.at > 600 ? key : state.text + key;
    state.at = now;
    const text = state.text.toLowerCase();
    const repeated = text.length > 1 && [...text].every((ch) => ch === text[0]);
    const query = repeated ? text[0] : text;
    const from = open ? active : selected;
    for (let step = repeated || text.length === 1 ? 1 : 0; step <= options.length; step++) {
      const index = (from + step + options.length) % options.length;
      if (options[index].toLowerCase().startsWith(query)) return index;
    }
    return -1;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    const printable = key.length === 1 && key !== " " && !event.ctrlKey && !event.metaKey && !event.altKey;
    if (!open) {
      if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === " ") {
        event.preventDefault();
        show(selected >= 0 ? selected : 0);
      } else if (key === "Home") {
        event.preventDefault();
        show(0);
      } else if (key === "End") {
        event.preventDefault();
        show(last);
      } else if (printable) {
        const index = search(key);
        if (index >= 0) show(index);
      }
      return;
    }
    switch (key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((index) => Math.min(last, index + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (event.altKey) commit(active);
        else setActive((index) => Math.max(0, index - 1));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(last);
        break;
      case "PageDown":
        event.preventDefault();
        setActive((index) => Math.min(last, index + 10));
        break;
      case "PageUp":
        event.preventDefault();
        setActive((index) => Math.max(0, index - 10));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(active);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        commit(active);
        break;
      default:
        if (printable) {
          const index = search(key);
          if (index >= 0) setActive(index);
        }
    }
  };

  // Hold det aktive alternativet synlig, og lukk når man klikker utenfor
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const listId = `${id}-list`;
  const labelId = `${id}-label`;
  return (
    <div className="form-field">
      <Label id={labelId} label={label} required={required} onClick={() => triggerRef.current?.focus()} />
      <div className="select" ref={rootRef}>
        <div
          ref={triggerRef}
          id={id}
          role="combobox"
          tabIndex={0}
          className="form-input select-trigger"
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && active >= 0 ? `${id}-option-${active}` : undefined}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onClick={() => (open ? setOpen(false) : show(selected >= 0 ? selected : 0))}
          onKeyDown={onKeyDown}
          onBlur={() => setOpen(false)}
        >
          <span className={value ? "select-value" : "select-value is-placeholder"}>{value || placeholder}</span>
          <svg className="select-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.5 6l4.5 4.5L12.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <ul ref={listRef} id={listId} role="listbox" aria-labelledby={labelId} className="select-list" hidden={!open} onMouseDown={(event) => event.preventDefault()}>
          {options.map((option, index) => (
            <li
              key={option}
              id={`${id}-option-${index}`}
              data-index={index}
              role="option"
              aria-selected={option === value}
              className={index === active ? "select-option is-active" : "select-option"}
              onPointerMove={() => setActive(index)}
              onClick={() => commit(index)}
            >
              <span>{option}</span>
              <svg className="select-check" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3.5 8.4l2.9 2.9 6.1-6.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </li>
          ))}
        </ul>
        <input type="hidden" name={name} value={value} />
      </div>
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </div>
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
