import { create } from "zustand";
import { Report, Category, MenuCategory, ReportWithCategory } from "@/types";
import {
  getAllReports,
  getReportWithCategory,
  createReport as apiCreateReport,
  updateReport as apiUpdateReport,
  deleteReport as apiDeleteReport,
} from "@/lib/api/reports";
import {
  getCategories,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
} from "@/lib/api/categories";
import {
  getUserAccessibleReports,
  getUserMenuStructure,
  userHasReportAccess,
} from "@/lib/api/access";

interface ReportState {
  // Data
  reports: Report[];
  categories: Category[];
  menuStructure: MenuCategory[];
  currentReport: ReportWithCategory | null;

  // UI State
  expandedCategories: Set<string>;
  isLoading: boolean;

  // Actions
  loadUserReports: (userId: string, userRole: string) => Promise<void>;
  loadAllReports: () => Promise<void>;
  loadAllCategories: () => Promise<void>;
  setCurrentReport: (reportId: string) => Promise<void>;
  clearCurrentReport: () => void;
  toggleCategory: (categoryId: string) => void;
  checkReportAccess: (userId: string, userRole: string, reportId: string) => Promise<boolean>;

  // Admin actions
  createReport: (report: Omit<Report, "id" | "createdAt">) => Promise<void>;
  updateReport: (id: string, updates: Partial<Report>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  createCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useReportStore = create<ReportState>((set, get) => ({
  reports: [],
  categories: [],
  menuStructure: [],
  currentReport: null,
  expandedCategories: new Set<string>(),
  isLoading: false,

  loadUserReports: async (userId, userRole) => {
    set({ isLoading: true });

    try {
      const accessibleReports = await getUserAccessibleReports(userId, userRole);
      const menuStructure = await getUserMenuStructure(userId, userRole);

      // Auto-expand first category
      const firstCategoryId = menuStructure[0]?.id;
      const expandedCategories = firstCategoryId
        ? new Set([firstCategoryId])
        : new Set<string>();

      set({
        reports: accessibleReports,
        menuStructure,
        expandedCategories,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading user reports:", error);
      set({ isLoading: false });
    }
  },

  loadAllReports: async () => {
    try {
      const reports = await getAllReports();
      set({ reports });
    } catch (error) {
      console.error("Error loading all reports:", error);
    }
  },

  loadAllCategories: async () => {
    try {
      const categories = await getCategories();
      set({ categories });
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  },

  setCurrentReport: async (reportId) => {
    try {
      const report = await getReportWithCategory(reportId);
      set({ currentReport: report });

      // Auto-expand the category of the current report
      if (report) {
        const { expandedCategories } = get();
        if (!expandedCategories.has(report.categoryId)) {
          set({
            expandedCategories: new Set([...expandedCategories, report.categoryId]),
          });
        }
      }
    } catch (error) {
      console.error("Error setting current report:", error);
    }
  },

  clearCurrentReport: () => {
    set({ currentReport: null });
  },

  toggleCategory: (categoryId) => {
    const { expandedCategories } = get();
    const newExpanded = new Set(expandedCategories);

    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }

    set({ expandedCategories: newExpanded });
  },

  checkReportAccess: async (userId, userRole, reportId) => {
    return await userHasReportAccess(userId, userRole, reportId);
  },

  // Admin actions
  createReport: async (reportData) => {
    const newReport = await apiCreateReport(reportData);
    if (!newReport) {
      throw new Error("Failed to create report");
    }
    set((state) => ({
      reports: [...state.reports, newReport],
    }));
  },

  updateReport: async (id, updates) => {
    const success = await apiUpdateReport(id, updates);
    if (!success) {
      throw new Error("Failed to update report");
    }
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    }));
  },

  deleteReport: async (id) => {
    const success = await apiDeleteReport(id);
    if (!success) {
      throw new Error("Failed to delete report");
    }
    // Remove from list
    set((state) => ({
      reports: state.reports.filter((r) => r.id !== id),
    }));
  },

  createCategory: async (categoryData) => {
    try {
      const newCategory = await apiCreateCategory(categoryData);
      if (newCategory) {
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  },

  updateCategory: async (id, updates) => {
    try {
      const success = await apiUpdateCategory(id, updates);
      if (success) {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  },

  deleteCategory: async (id) => {
    try {
      const success = await apiDeleteCategory(id);
      if (success) {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  },
}));
