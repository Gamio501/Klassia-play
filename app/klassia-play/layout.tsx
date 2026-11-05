export default function KlassiaPlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-app">{children}</div>
  );
}
