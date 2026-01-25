import type { Metadata } from "next";
import "./globals.css";
import { MainLayout } from "@/components/layout/main-layout";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ICPL × BI Report",
  description: "ระบบแสดงผล Power BI Reports สำหรับ ICP Ladda",
  icons: {
    icon: "https://i.ibb.co/4wdW4yvd/ICP-ladda-logo-01-Copy.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        <MainLayout>{children}</MainLayout>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
