import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Order Flow",
  description: "Painel de gerenciamento de pedidos",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}