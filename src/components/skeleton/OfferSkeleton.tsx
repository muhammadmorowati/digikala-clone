import { Skeleton } from "./skeleton";

export default function OfferSkeleton() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      role="status"
      aria-label="در حال بارگذاری پیشنهادها"
    >
      <Skeleton className="w-full h-72 rounded-none" />
      {/* Future content skeletons can be re-enabled if needed */}
      {/* <Skeleton className="h-4 w-5/6 rounded-lg" /> */}
      {/* <Skeleton className="h-4 w-5/6 rounded-lg" /> */}
    </div>
  );
}
