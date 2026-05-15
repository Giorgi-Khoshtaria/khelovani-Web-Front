import FormField from "./FormField";

interface PhoneInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function PhoneInput({
  id,
  label,
  value,
  onChange,
  error,
  fullWidth,
  disabled,
}: PhoneInputProps) {
  return (
    <FormField id={id} label={label} error={error} fullWidth={fullWidth}>
      <div className={`phone-input-wrapper${error ? " input-error" : ""}`}>
        <input
          type="tel"
          id={id}
          value={value}
          onChange={onChange}
          placeholder="+995 5XX XXX XXX"
          disabled={disabled}
        />
      </div>
    </FormField>
  );
}
