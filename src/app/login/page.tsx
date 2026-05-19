import { AppShell } from "@/components/layout/AppShell";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  return (
    <AppShell>
      <LoginForm error={params.error} />
    </AppShell>
  );
}
