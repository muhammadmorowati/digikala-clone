
import NotFound from "@/app/not-found";
import { serializeDoc } from "@/utils/serializeDoc";
import { Submenu, Product } from "@/utils/types";
import BreadcrumbContainer from "../product/BreadcrumbContainer";
import SubmenuProductsMain from "./SubmenuProductsMain";

export default async function SubmenuProductsContainer({ id }: { id: string }) {

  return (
    <div className="lg:py-5">
      <div className="px-4 breadcrumb-container flex overflow-x-auto overflow-y-hidden hide-scrollbar">
    
      </div>
      <div className="grid grid-cols-12 gap-5 lg:mt-10">

      </div>
    </div>
  );
}
