/* Sendeknappen. Mens skjemaet sendes: deaktivert, med en liten ring som går rundt og «Sender …». */
export function SubmitButton({ pending, label = "Send melding" }: { pending: boolean; label?: string }) {
  return (
    <button type="submit" className="btn btn-primary form-submit" disabled={pending} aria-busy={pending || undefined}>
      {pending ? (
        <>
          <span className="form-spinner" aria-hidden="true" />
          Sender …
        </>
      ) : (
        <>{label} <span className="btn-arrow" aria-hidden="true">↗</span></>
      )}
    </button>
  );
}
