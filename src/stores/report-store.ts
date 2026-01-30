import { create } from "zustand";
import { Report, ReportWithCategory, UserReportPreference, ReportWithPreference } from "@/types";
import {
  getAllReports,
  getReportWithCategory,
  createReport as apiCreateReport,
  updateReport as apiUpdateReport,
  deleteReport as apiDeleteReport,
} from "@/lib/api/reports";
import {
  getUserAccessibleReports,
} from "@/lib/api/access";
import {
  getUserPreferences,
  togglePinReport as apiTogglePin,
  updateReportOrder as apiUpdateReportOrder,
} from "@/lib/api/preferences";

interface ReportState {
  // Data - SEPARATED: userReports for sidebar, allReports for admin
  reports: Report[]; // User's accessible reports (for sidebar)
  allReports: Report[]; // All reports (for admin management only)
  preferences: UserReportPreference[];
  currentReport: ReportWithCategory | null;

  // UI State
  isLoading: boolean;

  // Computed - sorted reports with preferences
  getSortedReports: () => ReportWithPreference[];

  // Actions
  loadUserReports: (userId: string, userRole: string) => Promise<void>;
  loadAllReports: () => Promise<void>;
  loadPreferences: (userId: string) => Promise<void>;
  setCurrentReport: (reportId: string) => Promise<void>;
  clearCurrentReport: () => void;
  checkReportAccess: (userId: string, userRole: string, reportId: string) => Promise<boolean>;

  // Preference actions
  togglePin: (userId: string, reportId: string) => Promise<void>;
  reorderReports: (userId: string, reportIds: string[]) => Promise<void>;

  // Admin actions
  createReport: (report: Omit<Report, "id" | "createdAt">) => Promise<void>;
  updateReport: (id: string, updates: Partial<Report>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
}

export const useReportStore = create<ReportState>((set, get) => ({
  reports: [], // User's accessible reports (for sidebar)
  allReports: [], // All reports (for admin management only)
  preferences: [],
  currentReport: null,
  isLoading: false,

  // Get reports sorted by: 1) Pinned first, 2) Then by user sortOrder, 3) Then alphabetically
  getSortedReports: () => {
    const { reports, preferences } = get();

    // Map reports with their preferences
    const reportsWithPrefs: ReportWithPreference[] = reports
      .filter((r) => r.isActive)
      .map((report) => {
        const pref = preferences.find((p) => p.reportId === report.id);
        return {
          ...report,
          isPinned: pref?.isPinned ?? false,
          userSortOrder: pref?.sortOrder ?? 999999, // High number for unsorted reports
        };
      });

    // Sort: pinned first, then by userSortOrder, then alphabetically
    return reportsWithPrefs.sort((a, b) => {
      // Pinned reports first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Then by userSortOrder (lower = higher priority)
      if (a.userSortOrder !== b.userSortOrder) {
        return a.userSortOrder - b.userSortOrder;
      }

      // Finally alphabetically (Thai ก-ฮ, then English a-z)
      return a.name.localeCompare(b.name, "th");
    });
  },

  loadUserReports: async (userId, userRole) => {
    set({ isLoading: true });

    try {
      const [accessibleReports, userPreferences] = await Promise.all([
        getUserAccessibleReports(userId, userRole),
        getUserPreferences(userId),
      ]);

      set({
        reports: accessibleReports,
        preferences: userPreferences,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading user reports:", error);
      set({ isLoading: false });
    }
  },

  loadAllReports: async () => {
    try {
      const allReports = await getAllReports();
      set({ allReports }); // Write to allReports, not reports (to not affect sidebar)
    } catch (error) {
      console.error("Error loading all reports:", error);
    }
  },

  loadPreferences: async (userId) => {
    try {
      const preferences = await getUserPreferences(userId);
      set({ preferences });
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  },

  setCurrentReport: async (reportId) => {
    try {
      const report = await getReportWithCategory(reportId);
      set({ currentReport: report });
    } catch (error) {
      console.error("Error setting current report:", error);
    }
  },

  clearCurrentReport: () => {
    set({ currentReport: null });
  },

  checkReportAccess: async (userId, userRole, reportId) => {
    const { userHasReportAccess } = await import("@/lib/api/access");
    return await userHasReportAccess(userId, userRole, reportId);
  },

  // Toggle pin status
  togglePin: async (userId, reportId) => {
    const success = await apiTogglePin(userId, reportId);
    if (success) {
      // Update local state optimistically
      set((state) => {
        const existingPref = state.preferences.find(
          (p) => p.reportId === reportId
        );

        if (existingPref) {
          return {
            preferences: state.preferences.map((p) =>
              p.reportId === reportId
                ? { ...p, isPinned: !p.isPinned }
                : p
            ),
          };
        } else {
          // Create new preference entry
          return {
            preferences: [
              ...state.preferences,
              {
                id: `temp-${reportId}`,
                userId,
                reportId,
                isPinned: true,
                sortOrder: 0,
              },
            ],
          };
        }
      });
    }
  },

  // Reorder reports (after drag & drop)
  reorderReports: async (userId, reportIds) => {
    // Build order data - index becomes the sort order
    const reportOrders = reportIds.map((reportId, index) => ({
      reportId,
      sortOrder: index,
    }));

    // Optimistically update local state
    set((state) => {
      const newPreferences = [...state.preferences];

      reportOrders.forEach(({ reportId, sortOrder }) => {
        const existingIndex = newPreferences.findIndex((p) => p.reportId === reportId);

        if (existingIndex >= 0) {
          newPreferences[existingIndex] = {
            ...newPreferences[existingIndex],
            sortOrder,
          };
        } else {
          newPreferences.push({
            id: `temp-${reportId}`,
            userId,
            reportId,
            isPinned: false,
            sortOrder,
          });
        }
      });

      return { preferences: newPreferences };
    });

    // Save to database
    const success = await apiUpdateReportOrder(userId, reportOrders);
    if (!success) {
      // Reload preferences on failure
      get().loadPreferences(userId);
    }
  },

  // Admin actions - update allReports (admin management list)
  createReport: async (reportData) => {
    const newReport = await apiCreateReport(reportData);
    if (!newReport) {
      throw new Error("Failed to create report");
    }
    set((state) => ({
      allReports: [...state.allReports, newReport],
    }));
  },

  updateReport: async (id, updates) => {
    const success = await apiUpdateReport(id, updates);
    if (!success) {
      throw new Error("Failed to update report");
    }
    set((state) => ({
      allReports: state.allReports.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
      // Also update in reports if it exists there
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
    // Remove from both lists
    set((state) => ({
      allReports: state.allReports.filter((r) => r.id !== id),
      reports: state.reports.filter((r) => r.id !== id),
    }));
  },
}));
