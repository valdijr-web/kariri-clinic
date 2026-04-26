import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kariri Clinic - Login",
  description: "Faça login para acessar sua conta no Kariri Clinic",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>
        {children}
      </div>

  );
}