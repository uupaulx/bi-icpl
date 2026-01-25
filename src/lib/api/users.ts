import { supabase } from "@/lib/supabase/client";
import { User } from "@/types";

// Transform database user to app User type
const transformUser = (dbUser: {
  id: string;
  email: string;
  display_name: string;
  role: "admin" | "user";
  department: string | null;
  is_active: boolean;
  avatar_url: string | null;
  created_at: string;
  last_login: string | null;
}): User => ({
  id: dbUser.id,
  email: dbUser.email,
  displayName: dbUser.display_name,
  role: dbUser.role,
  department: dbUser.department || undefined,
  isActive: dbUser.is_active,
  avatarUrl: dbUser.avatar_url || undefined,
  createdAt: dbUser.created_at,
  lastLogin: dbUser.last_login || undefined,
});

// Get all users (admin only)
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("display_name");

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data.map(transformUser);
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return transformUser(data);
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }

  return transformUser(data);
}

// Update user role
export async function updateUserRole(
  userId: string,
  role: "admin" | "user"
): Promise<boolean> {
  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user role:", error);
    return false;
  }

  return true;
}

// Toggle user active status
export async function toggleUserActive(userId: string): Promise<boolean> {
  // Get current status
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("is_active")
    .eq("id", userId)
    .single();

  if (fetchError) {
    console.error("Error fetching user:", fetchError);
    return false;
  }

  // Toggle status
  const { error } = await supabase
    .from("users")
    .update({ is_active: !user.is_active })
    .eq("id", userId);

  if (error) {
    console.error("Error toggling user active:", error);
    return false;
  }

  return true;
}

// Update last login
export async function updateLastLogin(userId: string): Promise<void> {
  await supabase
    .from("users")
    .update({ last_login: new Date().toISOString() })
    .eq("id", userId);
}

// Create or update user from OAuth (upsert)
export async function upsertUser(user: {
  id?: string; // Auth user ID - important for RLS
  email: string;
  displayName: string;
  avatarUrl?: string;
}): Promise<User | null> {
  const insertData: Record<string, unknown> = {
    email: user.email,
    display_name: user.displayName,
    avatar_url: user.avatarUrl,
    last_login: new Date().toISOString(),
  };

  // Include id if provided (matches auth.users.id for RLS)
  if (user.id) {
    insertData.id = user.id;
  }

  const { data, error } = await supabase
    .from("users")
    .upsert(insertData, {
      onConflict: "email",
    })
    .select()
    .single();

  if (error) {
    console.error("Error upserting user:", error);
    return null;
  }

  return transformUser(data);
}
