import FormField from "./FormField";

interface TextareaInputProps {
  id: string;
  label: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  rows?: number;
  fullWidth?: boolean;
}

export default function TextareaInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  rows = 3,
  fullWidth,
}: TextareaInputProps) {
  const composedLabel = (
    <>
      {label}
      {hint && <span className="label-hint">{hint}</span>}
    </>
  );

  return (
    <FormField id={id} label={composedLabel} error={error} fullWidth={fullWidth}>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        className={error ? "input-error" : ""}
        placeholder={placeholder}
        rows={rows}
      />
    </FormField>
  );
}
