
import connectToDB from "@/config/mongodb";
import { serializeDoc } from "@/src/utils/serializeDoc";
import Navbar from "./Navbar";
import Topbar from "./Topbar";

export default async function Header() {
  await connectToDB();
  const categories = await CategoryModel.find({})
    .populate({
      path: "submenus",
      populate: {
        path: "items",
      },
    })
    .lean();

  const serializedCategories = serializeDoc(categories);

  return (
    <>
      <Topbar />
      <Navbar categories={serializedCategories} />
    </>
  );
}
