import { Product } from "@/src/utils/types";
import { mockCategories } from "./categoriesData";

export const mockProducts: Product[] = [
  {
      _id: "p1",
      title: "گوشی سامسونگ Galaxy S24 Ultra",
      thumbnail: "/images/galaxy-s24.jpg",
      price: 52000000,
      discount: 8,
      discount_price: 47800000,
      rating: 4.8,
      voter: 340,
      description: "گوشی پرچمدار سامسونگ.",
      recommended_percent: 96,
      categoryId: mockCategories[0]._id,
      submenuId: "1",
      submenuItemId: "i1",
      images: [],
      features: [],
      colors: []
  },
];