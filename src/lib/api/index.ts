// User API
export {
  getUsers,
  getUserById,
  getUserByEmail,
  updateUserRole,
  toggleUserActive,
  updateLastLogin,
  upsertUser,
} from "./users";

// Category API
export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categories";

// Report API
export {
  getAllReports,
  getActiveReports,
  getReportWithCategory,
  getReportsByCategory,
  createReport,
  updateReport,
  deleteReport,
} from "./reports";

// Access API
export {
  getAllAccess,
  getUserAccessibleReports,
  userHasReportAccess,
  getUserReports,
  getReportUsers,
  grantAccess,
  revokeAccess,
} from "./access";

// Activity API
export {
  logActivity,
  getRecentActivityLogs,
  getUserActivityLogs,
  getEntityActivityLogs,
  ActivityActions,
} from "./activity";
export type { ActivityAction } from "./activity";

// Preferences API
export {
  getUserPreferences,
  getReportPreference,
  togglePinReport,
  updateReportOrder,
  getPinnedReportIds,
} from "./preferences";
