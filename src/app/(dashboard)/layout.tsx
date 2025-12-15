import { Sidebar } from "@/components/layout/sidebar";
import { appConfig } from "@/lib/config";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Sidebar */}
      <div 
        className="fixed top-0 right-0 h-full z-50 hidden lg:block border-l border-gray-200 shadow-sm"
        style={{ 
          width: "280px", 
          backgroundColor: appConfig.design_system.colors.surface 
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="min-h-screen transition-all duration-300 lg:mr-[280px]">
        <div 
          className="mx-auto p-6 lg:p-10"
          style={{ maxWidth: "1600px" }}
        >
          {children}
        </div>
      </main>
    </>
  );
}

