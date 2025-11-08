
import connectToDB from "@/config/mongodb";
import { authUser } from "@/src/utils/auth";
import { redirect } from "next/navigation";

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
