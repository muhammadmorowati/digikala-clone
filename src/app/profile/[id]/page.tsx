import connectToDB from "@/config/mongodb";
import ProfileMain from "@/src/components/profile/ProfileMain";
import UserInfo from "@/src/components/profile/UserInfo";
import UserList from "@/src/components/profile/UserList";
import { authUser } from "@/src/utils/auth";
import { serializeDoc } from "@/src/utils/serializeDoc";
import { User } from "@/src/utils/types";


export default async function ProfileIdPage({
  params: { id },
}: {
  params: { id: string };
}) {
  await connectToDB();
  const user: User = await authUser();
  const products = await ProductModel.find({})
    .populate({
      path: "category",
      populate: {
        path: "submenus",
        populate: {
          path: "items",
        },
      },
    })
    .lean();

  const serializedProducts = serializeDoc(products);
  const serializedUser = serializeDoc(user);

  return (
    <div className="grid grid-cols-12 gap-5 lg:px-20 pb-20 lg:pt-10">
      <div className="col-span-4 border rounded-md py-5 max-lg:hidden">
        <UserInfo />
        <UserList id={id} />
      </div>
      <div className="col-span-8 max-lg:col-span-12 gap-5">
        <ProfileMain
          user={serializedUser}
          products={serializedProducts}
          id={id}
        />
      </div>
    </div>
  );
}
