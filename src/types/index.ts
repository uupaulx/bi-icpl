// User types
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  avatarUrl?: string;
}

// Category types (kept for DB compatibility)
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon: string;
  sortOrder: number;
}

// Report types
export interface Report {
  id: string;
  name: string;
  description?: string;
  embedUrl: string;
  categoryId: string; // Kept for DB compatibility but not used in UI
  sortOrder: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

// Report with category info (kept for DB compatibility)
export interface ReportWithCategory extends Report {
  category?: Category; // Made optional since we don't use categories anymore
}

// User-Report Access
export interface UserReportAccess {
  id: string;
  userId: string;
  reportId: string;
  grantedBy: string;
  grantedAt: string;
}

// User Report Preferences (personal pinned + sort order)
export interface UserReportPreference {
  id: string;
  userId: string;
  reportId: string;
  isPinned: boolean;
  sortOrder: number;
}

// Report with user preferences for display
export interface ReportWithPreference extends Report {
  isPinned: boolean;
  userSortOrder: number; // Personal sort order from drag & drop
}

// Auth state
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
