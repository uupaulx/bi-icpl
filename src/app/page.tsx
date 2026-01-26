"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useReportStore } from "@/stores/report-store";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { reports, loadUserReports, getSortedReports } = useReportStore();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserReports(user.id, user.role);
    }
  }, [user, loadUserReports]);

  useEffect(() => {
    if (!user || isRedirecting) return;

    // Wait for reports to load
    if (reports.length > 0) {
      setIsRedirecting(true);

      // Get sorted reports (respects user's pin/sort order)
      const sortedReports = getSortedReports();
      const activeReports = sortedReports.filter((r) => r.isActive);

      if (activeReports.length === 0) {
        // No active reports, redirect to admin for admin users
        if (user.role === "admin") {
          router.replace("/admin/users");
        }
        return;
      }

      // Check for last viewed report in localStorage
      const lastViewedReportId = localStorage.getItem("lastViewedReportId");

      if (lastViewedReportId) {
        // Check if user still has access to the last viewed report
        const lastViewedReport = activeReports.find(
          (r) => r.id === lastViewedReportId
        );

        if (lastViewedReport) {
          // User has access, redirect to last viewed report
          router.replace(`/reports/${lastViewedReportId}`);
          return;
        }
      }

      // Fallback: redirect to first report in sorted list
      router.replace(`/reports/${activeReports[0].id}`);
      return;
    }

    // If admin and no reports or still loading, redirect to admin users
    if (user.role === "admin") {
      // Small delay to check if reports will load
      const timeout = setTimeout(() => {
        if (reports.length === 0) {
          router.replace("/admin/users");
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [user, reports, router, getSortedReports, isRedirecting]);

  // MainLayout handles loading and auth redirect
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">กำลังนำคุณไปยัง Report...</p>
      </div>
    </div>
  );
}
