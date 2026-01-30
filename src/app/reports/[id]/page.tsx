"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useReportStore } from "@/stores/report-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, AlertTriangle } from "lucide-react";

// Add Power BI parameters to hide navigation bar
function getCleanEmbedUrl(url: string | undefined): string {
  if (!url) return "";
  try {
    const embedUrl = new URL(url);
    // Hide the bottom navigation pane (page selector, Power BI logo)
    embedUrl.searchParams.set("navContentPaneEnabled", "false");
    return embedUrl.toString();
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}

export default function ReportViewerPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentReport, setCurrentReport, clearCurrentReport, checkReportAccess } = useReportStore();
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const reportId = params.id as string;

  // Build clean embed URL (hide Power BI navigation bar)
  // Must be before any conditional returns to maintain hooks order
  const embedUrl = useMemo(
    () => getCleanEmbedUrl(currentReport?.embedUrl),
    [currentReport?.embedUrl]
  );

  useEffect(() => {
    if (reportId && user) {
      setCurrentReport(reportId);
      // Save last viewed report to localStorage
      localStorage.setItem("lastViewedReportId", reportId);
    }

    return () => {
      clearCurrentReport();
    };
  }, [reportId, user, setCurrentReport, clearCurrentReport]);

  // Handle fullscreen (double-click on iframe container)
  const handleDoubleClick = useCallback(() => {
    if (!document.fullscreenElement) {
      iframeContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Check access
  const hasAccess = user ? checkReportAccess(user.id, user.role, reportId) : false;

  if (!user) return null;

  // Access denied (applies to both Admin and User now)
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="text-muted-foreground text-center max-w-md">
          คุณไม่มีสิทธิ์ในการเข้าถึง Report นี้
          กรุณาติดต่อ Admin เพื่อขอสิทธิ์การเข้าถึง
        </p>
        <Button onClick={() => router.push("/")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับหน้าหลัก
        </Button>
      </div>
    );
  }

  // Report not found
  if (!currentReport) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">ไม่พบ Report</h1>
        <p className="text-muted-foreground text-center max-w-md">
          ไม่พบ Report ที่คุณต้องการ หรือ Report อาจถูกลบหรือปิดใช้งานแล้ว
        </p>
        <Button onClick={() => router.push("/")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับหน้าหลัก
        </Button>
      </div>
    );
  }

  // Clean report view - just the iframe
  return (
    <div
      ref={iframeContainerRef}
      className="h-full w-full"
      onDoubleClick={handleDoubleClick}
      title="ดับเบิลคลิกเพื่อเต็มหน้าจอ"
    >
      <iframe
        title={currentReport.name}
        src={embedUrl}
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );
}
