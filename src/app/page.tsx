import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GuestWorkspaceShell } from "@/components/layout/GuestWorkspaceShell";
import { LandingMarketing } from "@/components/marketing/LandingMarketing";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/chat");

  return (
    <GuestWorkspaceShell>
      <LandingMarketing />
    </GuestWorkspaceShell>
  );
}
