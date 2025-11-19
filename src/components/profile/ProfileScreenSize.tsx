import { ReactNode } from "react";
import UserInfo from "./UserInfo";
import UserList from "./UserList";
import UserOrders from "./UserOrders";
import WarnSection from "./WarnSection";
import { User } from "@/src/utils/types";

export type ProfileSectionId =
  | "orders"
  | "lists"
  | "comments"
  | "addresses"
  | "gift-cards"
  | "notification"
  | "user-history"
  | "personal-info"
  | "";

export default function ProfileScreenSize({
  id,
  user,
  children,
}: {
  id: ProfileSectionId;
  user: User;
  children?: ReactNode;
}) {

  const isDefaultPage = id === "";

  return (
    <div className="grid grid-cols-12 gap-5 lg:px-20 pb-20 lg:pt-10">

      {/* SIDEBAR */}
      <aside className="col-span-4 border rounded-md py-5 max-lg:hidden">
        <UserInfo user={user} />
        <UserList id={id} />
      </aside>

      {/* MAIN */}
      <main className="col-span-8 max-lg:col-span-12 gap-5">
        {isDefaultPage ? (
          <div className="flex flex-col gap-5 max-lg:hidden">
            <WarnSection />
            <UserOrders />
          </div>
        ) : (
          children
        )}
      </main>

    </div>
  );
}
