import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-6 md:px-10 lg:px-14 pt-4 relative">

      {/* Header */}
      <div className="group relative mb-2 -mt-16">
        <h1
          className="
            text-5xl md:text-6xl font-extrabold tracking-tight
            bg-clip-text text-transparent
            bg-gradient-to-r from-neutral-700 via-neutral-400 to-neutral-200
            dark:from-neutral-200 dark:via-neutral-100 dark:to-white
            drop-shadow-[0_4px_18px_rgba(0,0,0,0.25)]
            leading-tight
          "
        >
          Industry Insights
        </h1>

        <div
          className="
            h-[3px] w-0 group-hover:w-full mt-3
            bg-gradient-to-r from-neutral-400 via-neutral-200 to-white
            dark:from-neutral-500 dark:via-neutral-300 dark:to-white
            transition-all duration-700 rounded-full
          "
        />
      </div>

      <Suspense
        fallback={
          <div className="w-full py-12">
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
