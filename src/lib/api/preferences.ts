import { supabase } from "@/lib/supabase/client";
import { UserReportPreference } from "@/types";

// Database type
type DbPreference = {
  id: string;
  user_id: string;
  report_id: string;
  is_pinned: boolean;
  view_count: number; // Repurposed as sort_order in DB
};

// Transform DB preference to app type
const transformPreference = (db: DbPreference): UserReportPreference => ({
  id: db.id,
  userId: db.user_id,
  reportId: db.report_id,
  isPinned: db.is_pinned,
  sortOrder: db.view_count, // Using view_count column as sort_order
});

// Get all preferences for a user
export async function getUserPreferences(
  userId: string
): Promise<UserReportPreference[]> {
  const { data, error } = await supabase
    .from("user_report_preferences")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user preferences:", error);
    return [];
  }

  return (data as DbPreference[]).map(transformPreference);
}

// Get preference for a specific report
export async function getReportPreference(
  userId: string,
  reportId: string
): Promise<UserReportPreference | null> {
  const { data, error } = await supabase
    .from("user_report_preferences")
    .select("*")
    .eq("user_id", userId)
    .eq("report_id", reportId)
    .single();

  if (error) {
    // Not found is ok - user just hasn't interacted with this report yet
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching report preference:", error);
    return null;
  }

  return transformPreference(data as DbPreference);
}

// Toggle pin status for a report
export async function togglePinReport(
  userId: string,
  reportId: string
): Promise<boolean> {
  // First, try to get existing preference
  const existing = await getReportPreference(userId, reportId);

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from("user_report_preferences")
      .update({ is_pinned: !existing.isPinned })
      .eq("user_id", userId)
      .eq("report_id", reportId);

    if (error) {
      console.error("Error toggling pin:", error);
      return false;
    }
    return true;
  } else {
    // Create new with pinned = true
    const { error } = await supabase.from("user_report_preferences").insert({
      user_id: userId,
      report_id: reportId,
      is_pinned: true,
      view_count: 0, // Default sort order
    });

    if (error) {
      console.error("Error creating pinned preference:", error);
      return false;
    }
    return true;
  }
}

// Update sort order for multiple reports (after drag & drop)
export async function updateReportOrder(
  userId: string,
  reportOrders: { reportId: string; sortOrder: number }[]
): Promise<boolean> {
  // Use upsert to handle both new and existing preferences
  const upsertData = reportOrders.map((item) => ({
    user_id: userId,
    report_id: item.reportId,
    view_count: item.sortOrder, // Using view_count column as sort_order
    is_pinned: false, // Will be overwritten if exists
  }));

  // Process each item individually to preserve is_pinned status
  for (const item of reportOrders) {
    const existing = await getReportPreference(userId, item.reportId);

    if (existing) {
      // Update existing - keep is_pinned, update sort_order
      const { error } = await supabase
        .from("user_report_preferences")
        .update({ view_count: item.sortOrder })
        .eq("user_id", userId)
        .eq("report_id", item.reportId);

      if (error) {
        console.error("Error updating sort order:", error);
        return false;
      }
    } else {
      // Create new preference
      const { error } = await supabase.from("user_report_preferences").insert({
        user_id: userId,
        report_id: item.reportId,
        is_pinned: false,
        view_count: item.sortOrder,
      });

      if (error) {
        console.error("Error creating sort order preference:", error);
        return false;
      }
    }
  }

  return true;
}

// Get pinned report IDs for a user
export async function getPinnedReportIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("user_report_preferences")
    .select("report_id")
    .eq("user_id", userId)
    .eq("is_pinned", true);

  if (error) {
    console.error("Error fetching pinned reports:", error);
    return [];
  }

  return (data as { report_id: string }[]).map((d) => d.report_id);
}
