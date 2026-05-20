"use client";

type NumericPinInputProps = {
  name: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

export function NumericPinInput({ name, required = false, placeholder, className }: NumericPinInputProps) {
  return (
    <input
      name={name}
      type="password"
      inputMode="numeric"
      pattern="[0-9]{4}"
      maxLength={4}
      placeholder={placeholder}
      required={required}
      onInput={(event) => {
        event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 4);
      }}
      className={className}
    />
  );
}
