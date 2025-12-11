import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        px-8 md:px-32 lg:px-32
        relative
      "
    >
      <Suspense
        fallback={
          <div className="w-full py-10">
            <BarLoader
              width={'100%'}
              height={6}
              color="#888"
              className="
                dark:!bg-neutral-800
                !bg-neutral-300
                rounded-full
              "
            />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
