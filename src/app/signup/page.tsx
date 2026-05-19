import { AppShell } from "@/components/layout/AppShell";
import { SignupForm } from "./SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; email?: string }>;
}) {
  const params = await searchParams;

  return (
    <AppShell>
      <SignupForm email={params.email} error={params.error} />
    </AppShell>
  );
}
