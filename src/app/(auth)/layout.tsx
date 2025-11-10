
import { authUser } from "@/src/utils/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await authUser();
  if (user) redirect("/");

  return <div>{children}</div>;
}
