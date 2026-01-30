import { supabase } from "@/lib/supabase/client";
import { UserReportAccess, Report } from "@/types";

// Transform database access to app UserReportAccess type
const transformAccess = (dbAccess: {
  id: string;
  user_id: string;
  report_id: string;
  granted_by: string;
  granted_at: string;
}): UserReportAccess => ({
  id: dbAccess.id,
  userId: dbAccess.user_id,
  reportId: dbAccess.report_id,
  grantedBy: dbAccess.granted_by,
  grantedAt: dbAccess.granted_at,
});

// Get all access records
export async function getAllAccess(): Promise<UserReportAccess[]> {
  const { data, error } = await supabase
    .from("user_report_access")
    .select("*")
    .order("granted_at", { ascending: false });

  if (error) {
    console.error("Error fetching access records:", error);
    return [];
  }

  return data.map(transformAccess);
}

// Database types for type safety
type DbReport = {
  id: string;
  name: string;
  description: string | null;
  embed_url: string;
  category_id: string;
  sort_order: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
};

// Transform DB report to app Report
const transformDbReport = (r: DbReport): Report => ({
  id: r.id,
  name: r.name,
  description: r.description || undefined,
  embedUrl: r.embed_url,
  categoryId: r.category_id,
  sortOrder: r.sort_order,
  isActive: r.is_active,
  createdBy: r.created_by,
  createdAt: r.created_at,
});

// Get user's accessible reports (both Admin and User use same logic now)
// Admin manages all reports in admin page, but sees only granted reports in sidebar
export async function getUserAccessibleReports(
  userId: string,
  _userRole: string // kept for compatibility but not used anymore
): Promise<Report[]> {
  // All users (including Admin) only see reports they have access to
  // Admin can manage all reports in /admin/reports page separately

  // First get the report IDs the user has access to
  const { data: accessData, error: accessError } = await supabase
    .from("user_report_access")
    .select("report_id")
    .eq("user_id", userId);

  if (accessError || !accessData || accessData.length === 0) {
    if (accessError) console.error("Error fetching user access:", accessError);
    return [];
  }

  const reportIds = (accessData as { report_id: string }[]).map((a) => a.report_id);

  // Then fetch those reports
  const { data: reportData, error: reportError } = await supabase
    .from("reports")
    .select("*")
    .in("id", reportIds)
    .eq("is_active", true)
    .order("sort_order");

  if (reportError) {
    console.error("Error fetching user reports:", reportError);
    return [];
  }

  return (reportData as DbReport[]).map(transformDbReport);
}

// Check if user has access to report (Admin and User use same logic)
export async function userHasReportAccess(
  userId: string,
  _userRole: string, // kept for compatibility but not used anymore
  reportId: string
): Promise<boolean> {
  // All users (including Admin) must have explicit access to view reports
  // Admin can manage reports in admin pages, but must grant themselves access to view

  const { data, error } = await supabase
    .from("user_report_access")
    .select("id")
    .eq("user_id", userId)
    .eq("report_id", reportId)
    .single();

  if (error) {
    return false;
  }

  return Boolean(data);
}

// Get reports for a specific user
export async function getUserReports(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("user_report_access")
    .select("report_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user reports:", error);
    return [];
  }

  return (data as { report_id: string }[]).map((d) => d.report_id);
}

// Get users for a specific report
export async function getReportUsers(reportId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("user_report_access")
    .select("user_id")
    .eq("report_id", reportId);

  if (error) {
    console.error("Error fetching report users:", error);
    return [];
  }

  return (data as { user_id: string }[]).map((d) => d.user_id);
}

// Grant access to a report
export async function grantAccess(
  userId: string,
  reportId: string,
  grantedBy: string
): Promise<boolean> {
  const { error } = await supabase.from("user_report_access").insert({
    user_id: userId,
    report_id: reportId,
    granted_by: grantedBy,
  });

  if (error) {
    // Ignore duplicate key error
    if (error.code === "23505") {
      return true;
    }
    console.error("Error granting access:", error);
    return false;
  }

  return true;
}

// Revoke access to a report
export async function revokeAccess(
  userId: string,
  reportId: string
): Promise<boolean> {
  const { error } = await supabase
    .from("user_report_access")
    .delete()
    .eq("user_id", userId)
    .eq("report_id", reportId);

  if (error) {
    console.error("Error revoking access:", error);
    return false;
  }

  return true;
}
