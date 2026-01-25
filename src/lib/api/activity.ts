import { supabase } from "@/lib/supabase/client";

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

// Transform database activity log to app type
const transformActivityLog = (dbLog: {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}): ActivityLog => ({
  id: dbLog.id,
  userId: dbLog.user_id,
  action: dbLog.action,
  entityType: dbLog.entity_type,
  entityId: dbLog.entity_id || undefined,
  details: dbLog.details || undefined,
  createdAt: dbLog.created_at,
});

// Log an activity
export async function logActivity(
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, unknown>
): Promise<boolean> {
  const { error } = await supabase.from("activity_logs").insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
  });

  if (error) {
    console.error("Error logging activity:", error);
    return false;
  }

  return true;
}

// Get recent activity logs (admin only)
export async function getRecentActivityLogs(
  limit: number = 50
): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }

  return data.map(transformActivityLog);
}

// Get activity logs for a specific user
export async function getUserActivityLogs(
  userId: string,
  limit: number = 20
): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching user activity logs:", error);
    return [];
  }

  return data.map(transformActivityLog);
}

// Get activity logs for a specific entity
export async function getEntityActivityLogs(
  entityType: string,
  entityId: string,
  limit: number = 20
): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching entity activity logs:", error);
    return [];
  }

  return data.map(transformActivityLog);
}

// Activity action types for consistency
export const ActivityActions = {
  // Auth
  LOGIN: "login",
  LOGOUT: "logout",

  // Reports
  VIEW_REPORT: "view_report",
  CREATE_REPORT: "create_report",
  UPDATE_REPORT: "update_report",
  DELETE_REPORT: "delete_report",

  // Categories
  CREATE_CATEGORY: "create_category",
  UPDATE_CATEGORY: "update_category",
  DELETE_CATEGORY: "delete_category",

  // Users
  UPDATE_USER_ROLE: "update_user_role",
  TOGGLE_USER_ACTIVE: "toggle_user_active",

  // Access
  GRANT_ACCESS: "grant_access",
  REVOKE_ACCESS: "revoke_access",
} as const;

export type ActivityAction = (typeof ActivityActions)[keyof typeof ActivityActions];
