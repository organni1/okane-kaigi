type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number;
  required?: boolean;
  children?: React.ReactNode;
};

export function Field({ label, name, type = "text", placeholder, defaultValue, required, children }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-bold text-gray-800">
      {label}
      {children ?? (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          className="min-h-12 rounded-2xl border border-orange-100 bg-white px-4 text-base outline-none ring-orange-200 focus:ring-4"
        />
      )}
    </label>
  );
}
