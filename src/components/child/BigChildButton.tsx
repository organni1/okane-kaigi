import { Plus } from "lucide-react";
import { Button } from "@/components/common/Button";

export function BigChildButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button href={href} className="min-h-16 w-full rounded-[1.75rem] text-xl">
      <Plus size={30} />
      {children}
    </Button>
  );
}
