import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type Props = {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "outline";
  className?: string;
};

const styles = {
  primary: "bg-orange-500 text-white shadow-lg shadow-orange-200 hover:bg-orange-600",
  secondary: "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100",
  outline: "bg-white text-orange-600 border border-orange-300 hover:bg-orange-50",
};

export function Button({ children, href, type = "button", variant = "primary", className }: Props) {
  const classNames = cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-bold transition",
    styles[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classNames}>
      {children}
    </button>
  );
}
