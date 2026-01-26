import { supabase } from "@/lib/supabase/client";
import { Report, ReportWithCategory } from "@/types";

// Transform database report to app Report type
const transformReport = (dbReport: {
  id: string;
  name: string;
  description: string | null;
  embed_url: string;
  category_id: string;
  sort_order: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
}): Report => ({
  id: dbReport.id,
  name: dbReport.name,
  description: dbReport.description || undefined,
  embedUrl: dbReport.embed_url,
  categoryId: dbReport.category_id,
  sortOrder: dbReport.sort_order,
  isActive: dbReport.is_active,
  createdBy: dbReport.created_by,
  createdAt: dbReport.created_at,
});

// Transform database report with category (category is optional)
const transformReportWithCategory = (
  dbReport: {
    id: string;
    name: string;
    description: string | null;
    embed_url: string;
    category_id: string;
    sort_order: number;
    is_active: boolean;
    created_by: string;
    created_at: string;
    categories?: {
      id: string;
      name: string;
      description: string | null;
      icon: string;
      sort_order: number;
    } | null;
  }
): ReportWithCategory => ({
  id: dbReport.id,
  name: dbReport.name,
  description: dbReport.description || undefined,
  embedUrl: dbReport.embed_url,
  categoryId: dbReport.category_id,
  sortOrder: dbReport.sort_order,
  isActive: dbReport.is_active,
  createdBy: dbReport.created_by,
  createdAt: dbReport.created_at,
  category: dbReport.categories ? {
    id: dbReport.categories.id,
    name: dbReport.categories.name,
    description: dbReport.categories.description || undefined,
    icon: dbReport.categories.icon,
    sortOrder: dbReport.categories.sort_order,
  } : undefined,
});

// Get all reports (admin only)
export async function getAllReports(): Promise<Report[]> {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Error fetching reports:", error);
    return [];
  }

  return data.map(transformReport);
}

// Get active reports
export async function getActiveReports(): Promise<Report[]> {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("Error fetching active reports:", error);
    return [];
  }

  return data.map(transformReport);
}

// Get report by ID with category
export async function getReportWithCategory(
  id: string
): Promise<ReportWithCategory | null> {
  const { data, error } = await supabase
    .from("reports")
    .select(
      `
      *,
      categories (*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching report:", error);
    return null;
  }

  return transformReportWithCategory(data as {
    id: string;
    name: string;
    description: string | null;
    embed_url: string;
    category_id: string;
    sort_order: number;
    is_active: boolean;
    created_by: string;
    created_at: string;
    categories?: {
      id: string;
      name: string;
      description: string | null;
      icon: string;
      sort_order: number;
    } | null;
  });
}

// Get reports by category
export async function getReportsByCategory(
  categoryId: string
): Promise<Report[]> {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("Error fetching reports by category:", error);
    return [];
  }

  return data.map(transformReport);
}

// Create report
export async function createReport(
  report: Omit<Report, "id" | "createdAt">
): Promise<Report | null> {
  const { data, error } = await supabase
    .from("reports")
    .insert({
      name: report.name,
      description: report.description,
      embed_url: report.embedUrl,
      category_id: report.categoryId,
      sort_order: report.sortOrder,
      is_active: report.isActive,
      created_by: report.createdBy,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating report:", error);
    return null;
  }

  return transformReport(data);
}

// Update report
export async function updateReport(
  id: string,
  updates: Partial<Omit<Report, "id" | "createdAt" | "createdBy">>
): Promise<boolean> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.embedUrl !== undefined) dbUpdates.embed_url = updates.embedUrl;
  if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
  if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;
  if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

  const { data, error } = await supabase
    .from("reports")
    .update(dbUpdates)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating report:", error);
    return false;
  }

  // Check if any rows were actually updated (RLS might block silently)
  if (!data || data.length === 0) {
    console.error("Update failed: No rows updated (possibly blocked by RLS)");
    return false;
  }

  return true;
}

// Hard delete report (actually remove from database)
export async function deleteReport(id: string): Promise<boolean> {
  // First, delete related user_report_access entries
  await supabase
    .from("user_report_access")
    .delete()
    .eq("report_id", id);

  // Then delete the report
  const { error, count } = await supabase
    .from("reports")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting report:", error);
    return false;
  }

  // For delete operations, we can't easily check affected rows
  // but if no error, it's likely successful
  console.log("Report deleted successfully:", id);
  return true;
}
