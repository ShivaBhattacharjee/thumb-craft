import { auth } from "@/auth";
import { AppShell } from "@/components/app-shell";
import { Workspace } from "@/components/workspace";

export default async function Home() {
  const session = await auth();

  return (
    <AppShell user={session?.user}>
      <Workspace />
    </AppShell>
  );
}
