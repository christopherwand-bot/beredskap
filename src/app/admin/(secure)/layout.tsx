import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminSecureLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const ok = await isAuthenticated();

  if (!ok) {
    redirect("/admin/login");
  }

  return children;
}
