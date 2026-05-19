import Image from "next/image";
import { Button } from "@/components/common/Button";

export function EmptyState({ title, body, href, action }: { title: string; body: string; href?: string; action?: string }) {
  return (
    <div className="soft-card grid gap-4 rounded-3xl p-6 text-center">
      <Image src="/assets/images/star-character.png" alt="" width={88} height={88} className="mx-auto" />
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">{body}</p>
      </div>
      {href && action ? <Button href={href}>{action}</Button> : null}
    </div>
  );
}
