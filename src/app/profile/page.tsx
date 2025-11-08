import ProfileHeader from "@/src/components/profile/ProfileHeader";
import ProfileScreenSize from "@/src/components/profile/ProfileScreenSize";
import UserInfo from "@/src/components/profile/UserInfo";
import UserList from "@/src/components/profile/UserList";
import UserOrders from "@/src/components/profile/UserOrders";
import WarnSection from "@/src/components/profile/WarnSection";


export default function ProfilePage({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <div>
      <div className="flex flex-col gap-10 lg:hidden">
        <ProfileHeader />
        <UserInfo />
        <WarnSection />
        <UserOrders />
        <hr className="border-4 border-neutral-200 dark:border-neutral-700" />
        <div className="-mt-10">
          <UserList id={id} />
        </div>
      </div>

      {/* Desktop Size */}
      <ProfileScreenSize id={id} />
    </div>
  );
}
