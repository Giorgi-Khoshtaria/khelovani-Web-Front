import { useState } from "react";

export const useFormHandler = <T,>(
  initialForm: T,
) => {
  const [formData, setFormData] = useState<T>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const target = e.target;
    const { id, value } = target;

    const isCheckbox =
      target instanceof HTMLInputElement && target.type === "checkbox";
    const nextValue = isCheckbox ? target.checked : value;

    setFormData((prev) => ({ ...prev, [id]: nextValue }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  return { formData, setFormData, errors, setErrors, handleChange };
};