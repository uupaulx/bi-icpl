import { create } from "zustand";
import { User, UserReportAccess } from "@/types";
import {
  getUsers,
  updateUserRole as apiUpdateUserRole,
  toggleUserActive as apiToggleUserActive,
} from "@/lib/api/users";
import {
  getAllAccess,
  getUserReports,
  getReportUsers,
  grantAccess as apiGrantAccess,
  revokeAccess as apiRevokeAccess,
} from "@/lib/api/access";

interface UserState {
  users: User[];
  userReportAccess: UserReportAccess[];
  isLoading: boolean;

  // Actions
  loadUsers: () => Promise<void>;
  loadUserReportAccess: () => Promise<void>;
  updateUserRole: (userId: string, role: "admin" | "user") => Promise<void>;
  toggleUserActive: (userId: string) => Promise<void>;

  // Access management
  grantAccess: (userId: string, reportId: string, grantedBy: string) => Promise<void>;
  revokeAccess: (userId: string, reportId: string) => Promise<void>;
  getUserReports: (userId: string) => Promise<string[]>;
  getReportUsers: (reportId: string) => Promise<string[]>;
  bulkGrantAccess: (userIds: string[], reportIds: string[], grantedBy: string) => Promise<void>;
  bulkRevokeAccess: (userIds: string[], reportIds: string[]) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  userReportAccess: [],
  isLoading: false,

  loadUsers: async () => {
    set({ isLoading: true });
    try {
      const users = await getUsers();
      set({ users, isLoading: false });
    } catch (error) {
      console.error("Error loading users:", error);
      set({ isLoading: false });
    }
  },

  loadUserReportAccess: async () => {
    try {
      const userReportAccess = await getAllAccess();
      set({ userReportAccess });
    } catch (error) {
      console.error("Error loading user report access:", error);
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const success = await apiUpdateUserRole(userId, role);
      if (success) {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, role } : u
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  },

  toggleUserActive: async (userId) => {
    try {
      const success = await apiToggleUserActive(userId);
      if (success) {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, isActive: !u.isActive } : u
          ),
        }));
      }
    } catch (error) {
      console.error("Error toggling user active:", error);
    }
  },

  grantAccess: async (userId, reportId, grantedBy) => {
    const { userReportAccess } = get();

    // Check if access already exists
    const exists = userReportAccess.some(
      (a) => a.userId === userId && a.reportId === reportId
    );

    if (exists) return;

    try {
      const success = await apiGrantAccess(userId, reportId, grantedBy);
      if (success) {
        const newAccess: UserReportAccess = {
          id: `acc-${Date.now()}`,
          userId,
          reportId,
          grantedBy,
          grantedAt: new Date().toISOString(),
        };

        set((state) => ({
          userReportAccess: [...state.userReportAccess, newAccess],
        }));
      }
    } catch (error) {
      console.error("Error granting access:", error);
    }
  },

  revokeAccess: async (userId, reportId) => {
    try {
      const success = await apiRevokeAccess(userId, reportId);
      if (success) {
        set((state) => ({
          userReportAccess: state.userReportAccess.filter(
            (a) => !(a.userId === userId && a.reportId === reportId)
          ),
        }));
      }
    } catch (error) {
      console.error("Error revoking access:", error);
    }
  },

  getUserReports: async (userId) => {
    return await getUserReports(userId);
  },

  getReportUsers: async (reportId) => {
    return await getReportUsers(reportId);
  },

  bulkGrantAccess: async (userIds, reportIds, grantedBy) => {
    const { userReportAccess } = get();
    const newAccesses: UserReportAccess[] = [];

    for (const userId of userIds) {
      for (const reportId of reportIds) {
        const exists = userReportAccess.some(
          (a) => a.userId === userId && a.reportId === reportId
        );

        if (!exists) {
          try {
            const success = await apiGrantAccess(userId, reportId, grantedBy);
            if (success) {
              newAccesses.push({
                id: `acc-${Date.now()}-${userId}-${reportId}`,
                userId,
                reportId,
                grantedBy,
                grantedAt: new Date().toISOString(),
              });
            }
          } catch (error) {
            console.error("Error in bulk grant access:", error);
          }
        }
      }
    }

    if (newAccesses.length > 0) {
      set((state) => ({
        userReportAccess: [...state.userReportAccess, ...newAccesses],
      }));
    }
  },

  bulkRevokeAccess: async (userIds, reportIds) => {
    for (const userId of userIds) {
      for (const reportId of reportIds) {
        try {
          await apiRevokeAccess(userId, reportId);
        } catch (error) {
          console.error("Error in bulk revoke access:", error);
        }
      }
    }

    set((state) => ({
      userReportAccess: state.userReportAccess.filter(
        (a) =>
          !(userIds.includes(a.userId) && reportIds.includes(a.reportId))
      ),
    }));
  },
}));
