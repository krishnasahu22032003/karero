export default function MainLayout({children}: Readonly<{
    children:React.ReactNode
}>){
return (
    <div className="container mx-auto mt-28 mb-30">
        {children}
    </div>
)
}