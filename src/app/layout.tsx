import type { Metadata } from "next";
import { Zain } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { UserProvider } from "@/contexts/UserContext";
import { DataProvider } from "@/contexts/DataContext";
import { appConfig } from "@/lib/config";

const zain = Zain({ 
  subsets: ["arabic", "latin"], 
  weight: ["300", "400", "700", "800"],
  variable: "--font-zain"
});

export const metadata: Metadata = {
  title: appConfig.app_config.name,
  description: "مركز القيادة التنفيذي - نظام إدارة الشركة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={appConfig.app_config.language} dir={appConfig.app_config.direction}>
      <body 
        className={`${zain.className} antialiased`}
        style={{ 
          backgroundColor: appConfig.design_system.colors.bg, 
          color: appConfig.design_system.colors.text_primary 
        }}
      >
        <AuthProvider>
          <UserProvider>
            <DataProvider>
              {children}
            </DataProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
