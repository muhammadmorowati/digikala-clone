import { services } from "@/src/data/data";
import Image, { StaticImageData } from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";

export default function Services() {
  return (
    <div className="flex justify-between items-start my-8 lg:px-4 !mx-auto w-full">
      {/* Desktop view */}
      {services.map((service) => (
        <div
          key={service.title}
          className="max-lg:hidden flex flex-col w-full gap-2 justify-center items-center"
        >
          <ServiceItem title={service.title} image={service.image} />
        </div>
      ))}

      {/* Mobile carousel */}
      <Carousel
        opts={{
          align: "start",
          direction: "rtl",
        }}
        className="w-full lg:hidden"
      >
        <CarouselContent>
          {services.map((service) => (
            <CarouselItem
              key={service.title}
              className="cursor-pointer lg:basis-28 basis-24 p-0 lg:mx-2"
            >
              <ServiceItem title={service.title} image={service.image} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

function ServiceItem({
  title,
  image,
}: {
  title: string;
  image: string | StaticImageData;
}) {
  return (
    <div className="flex flex-col w-full gap-2 justify-center items-center">
      <Image alt={title} width={55} height={55} src={image} />
      <p className="text-center text-xs w-14 leading-6">{title}</p>
    </div>
  );
}
