import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beredskapsavisa",
  description: "En rask og enkel nettavis for krise- og beredskapsøvelser."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}
