export default function Layout({children}:{
    children:React.ReactNode
}){

return(
    <div className="px-5">
        <div className="items-center justify-between flex mb-5">
            <h1 className="text-6xl gradient font-extrabold tracking-tighter text-transparent bg-clip-text pb-2 pr-2">Industry Insights </h1>
        </div>
        {children}
    </div>
)


}