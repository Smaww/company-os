export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth pages have no sidebar
  return <>{children}</>;
}

