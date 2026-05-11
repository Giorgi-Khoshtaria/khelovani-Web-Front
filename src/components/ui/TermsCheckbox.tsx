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
  const { t: tValidation } = useClientTranslation(["validation"]);

  return (
    <div className="terms-container form-group--full">
      <input type="checkbox" id={id} checked={checked} onChange={onChange} />
      <label htmlFor={id}>
        <Link href={termsTo}>{tNav("terms_link")}</Link>
      </label>
      {error && <span className="error-text">{tValidation(error)}</span>}
    </div>
  );
}
