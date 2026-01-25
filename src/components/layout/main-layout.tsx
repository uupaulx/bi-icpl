"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated, isLoading, refreshUser } = useAuthStore();
  const { sidebarCollapsed } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if viewing a report
  const isReportView = pathname.startsWith("/reports/");

  // Refresh user on mount (check Supabase session)
  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setIsInitialized(true);
    };
    init();
  }, [refreshUser]);

  useEffect(() => {
    // Skip auth check on login page or auth callback
    if (pathname === "/login" || pathname.startsWith("/auth/")) return;

    // Only redirect after initialization is complete
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, isInitialized, pathname, router]);

  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground text-sm">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // Don't render layout on login page or auth callback
  if (pathname === "/login" || pathname.startsWith("/auth/")) {
    return <>{children}</>;
  }

  // Redirect will happen in useEffect, show loading in meantime
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">กำลังเปลี่ยนเส้นทาง...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar collapsed={sidebarCollapsed} />
      <main
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "md:pl-16" : "md:pl-64",
          // Remove padding on report view for full width
          isReportView ? "p-0" : ""
        )}
      >
        <div
          className={cn(
            isReportView
              ? "h-[calc(100vh-3rem)]" // Full height minus header (h-12 = 48px = 3rem)
              : "container mx-auto p-4 md:p-6"
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
