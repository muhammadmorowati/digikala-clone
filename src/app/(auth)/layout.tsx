import { authUser } from "@/utils/auth";
import { redirect } from "next/navigation";
import connectToDB from "@/../config/mongodb";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectToDB();
  const user = await authUser();
  if (user) redirect("/");

  return <div>{children}</div>;
}
