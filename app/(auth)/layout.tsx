export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="justify-center pt-10 flex">
      {children}
    </div>
  );
}
