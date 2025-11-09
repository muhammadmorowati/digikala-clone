
import { serializeDoc } from "@/utils/serializeDoc";
import { Product } from "@/utils/types";
import SearchbarForm from "./SearchbarForm";

export default async function Searchbar({
  placeholder,
}: {
  placeholder?: string;
}) {

  return (
    <SearchbarForm placeholder={placeholder} products={[]} />
  );
}
