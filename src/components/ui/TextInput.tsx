import FormField from "./FormField";

interface TextInputProps {
  id: string;
  label: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
  error?: string;
  maxLength?: number;
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function TextInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  maxLength,
  fullWidth,
  disabled,
}: TextInputProps) {
  return (
    <FormField id={id} label={label} error={error} fullWidth={fullWidth}>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={error ? "input-error" : ""}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
      />
    </FormField>
  );
}
