import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function SelectInput({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  fullWidth,
  disabled,
}: SelectInputProps) {
  const { t } = useClientTranslation(["validation"]);

  return (
    <div className={`form-group${fullWidth ? " form-group--full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={error ? "input-error" : ""}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="error-text">{t(error)}</span>}
    </div>
  );
}
