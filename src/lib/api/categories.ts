import { supabase } from "@/lib/supabase/client";
import { Category } from "@/types";

// Transform database category to app Category type
const transformCategory = (dbCategory: {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  sort_order: number;
}): Category => ({
  id: dbCategory.id,
  name: dbCategory.name,
  description: dbCategory.description || undefined,
  icon: dbCategory.icon,
  sortOrder: dbCategory.sort_order,
});

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data.map(transformCategory);
}

// Get category by ID
export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return transformCategory(data);
}

// Create category
export async function createCategory(
  category: Omit<Category, "id">
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: category.name,
      description: category.description,
      icon: category.icon,
      sort_order: category.sortOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    return null;
  }

  return transformCategory(data);
}

// Update category
export async function updateCategory(
  id: string,
  updates: Partial<Omit<Category, "id">>
): Promise<boolean> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
  if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

  const { error } = await supabase
    .from("categories")
    .update(dbUpdates)
    .eq("id", id);

  if (error) {
    console.error("Error updating category:", error);
    return false;
  }

  return true;
}

// Delete category
export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    return false;
  }

  return true;
}
