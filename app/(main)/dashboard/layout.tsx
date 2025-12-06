import { Suspense } from "react"
import { BarLoader } from "react-spinners";

export default function Layout({children}:{
    children:React.ReactNode
}){

return(
    <div className="px-5">
        <div className="items-center justify-between flex mb-5">
            <h1 className="text-6xl gradient font-extrabold tracking-tighter text-transparent bg-clip-text pb-2 pr-2">Industry Insights </h1>
        </div>
        <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
)


}