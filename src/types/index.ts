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

// Category types
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
  categoryId: string;
  sortOrder: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

// Report with category info
export interface ReportWithCategory extends Report {
  category: Category;
}

// User-Report Access
export interface UserReportAccess {
  id: string;
  userId: string;
  reportId: string;
  grantedBy: string;
  grantedAt: string;
}

// Menu structure for sidebar
export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  sortOrder: number;
  reports: MenuReport[];
}

export interface MenuReport {
  id: string;
  name: string;
  sortOrder: number;
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
