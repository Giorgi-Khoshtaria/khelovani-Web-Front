import Link from "next/link";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

interface TermsCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  termsTo?: string;
}

export default function TermsCheckbox({
  id,
  checked,
  onChange,
  error,
  termsTo = "/terms",
}: TermsCheckboxProps) {
  const { t: tNav } = useClientTranslation("navigation");
  const { t: tInputs } = useClientTranslation("inputs");

  return (
    <div className="terms-container form-group--full">
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} />
        <label htmlFor={id}>
          <Link href={termsTo}>{tNav("terms_link")}</Link>
        </label>
      </div>
      {error && <span className="error-text">{tInputs(error)}</span>}
    </div>
  );
}
