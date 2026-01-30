"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useReportStore } from "@/stores/report-store";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Shield,
  User as UserIcon,
  Check,
  X,
  FileText,
  LayoutGrid,
  Users,
  Settings2,
} from "lucide-react";
import { formatDateTime, cn } from "@/lib/utils";
import { User, Report } from "@/types";

type ViewMode = "cards" | "matrix";

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { reports, loadAllReports } = useReportStore();
  const {
    users,
    userReportAccess,
    loadUsers,
    loadUserReportAccess,
    updateUserRole,
    toggleUserActive,
    getUserReports,
    grantAccess,
    revokeAccess,
  } = useUserStore();

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [userReportCounts, setUserReportCounts] = useState<Record<string, string[]>>({});

  // Sheet state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Matrix filters
  const [matrixUserSearch, setMatrixUserSearch] = useState("");
  const [matrixReportSearch, setMatrixReportSearch] = useState("");

  const loadUserReportData = useCallback(async () => {
    const data: Record<string, string[]> = {};
    for (const user of users) {
      // Load access data for ALL users including Admin
      const userReports = await getUserReports(user.id);
      data[user.id] = userReports;
    }
    setUserReportCounts(data);
  }, [users, getUserReports]);

  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      router.push("/");
      return;
    }
    loadUsers();
    loadAllReports();
    loadUserReportAccess();
  }, [currentUser, router, loadUsers, loadAllReports, loadUserReportAccess]);

  useEffect(() => {
    if (users.length > 0) {
      loadUserReportData();
    }
  }, [users, loadUserReportData]);

  const activeReports = useMemo(() => reports.filter((r) => r.isActive), [reports]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.displayName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.department?.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [users, search]);

  const regularUsers = useMemo(() => users.filter((u) => u.role === "user"), [users]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRoleChange = (userId: string, newRole: "admin" | "user") => {
    if (userId === currentUser?.id) {
      alert("ไม่สามารถเปลี่ยน Role ของตัวเองได้");
      return;
    }
    updateUserRole(userId, newRole);
  };

  const handleToggleActive = (userId: string) => {
    if (userId === currentUser?.id) {
      alert("ไม่สามารถปิดใช้งานบัญชีของตัวเองได้");
      return;
    }
    toggleUserActive(userId);
  };

  const handleToggleAccess = (userId: string, reportId: string) => {
    const hasAccess = userReportAccess.some(
      (a) => a.userId === userId && a.reportId === reportId
    );
    if (hasAccess) {
      revokeAccess(userId, reportId);
    } else if (currentUser) {
      grantAccess(userId, reportId, currentUser.id);
    }
    // Update local state for immediate feedback
    setUserReportCounts((prev) => {
      const current = prev[userId] || [];
      if (hasAccess) {
        return { ...prev, [userId]: current.filter((id) => id !== reportId) };
      } else {
        return { ...prev, [userId]: [...current, reportId] };
      }
    });
  };

  const userHasAccess = (userId: string, reportId: string) => {
    return userReportAccess.some(
      (a) => a.userId === userId && a.reportId === reportId
    );
  };

  const openAccessSheet = (user: User) => {
    setSelectedUser(user);
    setSheetOpen(true);
  };

  const handleSelectAllReports = (userId: string, selectAll: boolean) => {
    if (!currentUser) return;
    activeReports.forEach((report) => {
      const hasAccess = userHasAccess(userId, report.id);
      if (selectAll && !hasAccess) {
        grantAccess(userId, report.id, currentUser.id);
      } else if (!selectAll && hasAccess) {
        revokeAccess(userId, report.id);
      }
    });
    // Update local state
    setUserReportCounts((prev) => ({
      ...prev,
      [userId]: selectAll ? activeReports.map((r) => r.id) : [],
    }));
  };

  const getUserAccessedReports = (userId: string): Report[] => {
    return activeReports.filter((r) => userHasAccess(userId, r.id));
  };

  // Matrix view filtered data
  const matrixFilteredUsers = useMemo(() => {
    return regularUsers.filter(
      (u) =>
        u.displayName.toLowerCase().includes(matrixUserSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(matrixUserSearch.toLowerCase())
    );
  }, [regularUsers, matrixUserSearch]);

  const matrixFilteredReports = useMemo(() => {
    return activeReports.filter(
      (r) =>
        r.name.toLowerCase().includes(matrixReportSearch.toLowerCase()) ||
        r.description?.toLowerCase().includes(matrixReportSearch.toLowerCase())
    );
  }, [activeReports, matrixReportSearch]);

  if (!currentUser || currentUser.role !== "admin") return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">จัดการผู้ใช้และสิทธิ์</h1>
          <p className="text-muted-foreground">
            จัดการผู้ใช้งานและกำหนดสิทธิ์การเข้าถึง Reports
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
          <Button
            variant={viewMode === "cards" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            ดูตามผู้ใช้
          </Button>
          <Button
            variant={viewMode === "matrix" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("matrix")}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            ดูตาราง
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="ค้นหาชื่อ, อีเมล หรือแผนก..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cards View */}
      {viewMode === "cards" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.map((user) => {
            const isCurrentUser = user.id === currentUser.id;
            const isAdmin = user.role === "admin";
            const accessedReports = getUserAccessedReports(user.id);
            const reportCount = accessedReports.length; // Same logic for both Admin and User now

            return (
              <Card key={user.id} className={cn(!user.isActive && "opacity-60")}>
                <CardContent className="pt-6">
                  {/* User Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-sm bg-primary/10">
                          {getInitials(user.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{user.displayName}</p>
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs">คุณ</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.department && (
                          <p className="text-xs text-muted-foreground">{user.department}</p>
                        )}
                      </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={() => handleToggleActive(user.id)}
                        disabled={isCurrentUser}
                      />
                    </div>
                  </div>

                  {/* Role & Reports Count */}
                  <div className="flex items-center gap-2 mb-4">
                    <Select
                      value={user.role}
                      onValueChange={(value: "admin" | "user") =>
                        handleRoleChange(user.id, value)
                      }
                      disabled={isCurrentUser}
                    >
                      <SelectTrigger className="w-[110px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Admin
                          </div>
                        </SelectItem>
                        <SelectItem value="user">
                          <div className="flex items-center gap-1">
                            <UserIcon className="h-3 w-3" />
                            User
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Badge variant={isAdmin ? "default" : "secondary"} className="gap-1">
                      <FileText className="h-3 w-3" />
                      {reportCount} reports
                    </Badge>
                  </div>

                  {/* Report Badges - Show for ALL users including Admin */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {accessedReports.slice(0, 3).map((report) => (
                        <Badge
                          key={report.id}
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {report.name.length > 15
                            ? report.name.slice(0, 15) + "..."
                            : report.name}
                        </Badge>
                      ))}
                      {accessedReports.length > 3 && (
                        <Badge variant="outline" className="text-xs font-normal">
                          +{accessedReports.length - 3}
                        </Badge>
                      )}
                      {accessedReports.length === 0 && (
                        <span className="text-xs text-muted-foreground">
                          ยังไม่มีสิทธิ์เข้าถึง Report
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Last Login */}
                  <div className="text-xs text-muted-foreground mb-4">
                    เข้าใช้ล่าสุด:{" "}
                    {user.lastLogin ? formatDateTime(user.lastLogin) : "ยังไม่เคยเข้าใช้"}
                  </div>

                  {/* Action Button - Show for ALL users including Admin */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => openAccessSheet(user)}
                  >
                    <Settings2 className="h-4 w-4" />
                    จัดการสิทธิ์
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          {filteredUsers.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">ไม่พบผู้ใช้</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Matrix View */}
      {viewMode === "matrix" && (
        <Card>
          <CardHeader>
            <CardTitle>Access Matrix</CardTitle>
            <CardDescription>
              ภาพรวมสิทธิ์การเข้าถึงทั้งหมด (คลิกเพื่อเปลี่ยนสถานะ)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Matrix Filters */}
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาผู้ใช้..."
                  value={matrixUserSearch}
                  onChange={(e) => setMatrixUserSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="ค้นหา Report..."
                  value={matrixReportSearch}
                  onChange={(e) => setMatrixReportSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-auto max-h-[500px] border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-background z-10 min-w-[180px]">
                      ผู้ใช้
                    </TableHead>
                    {matrixFilteredReports.map((report) => (
                      <TableHead
                        key={report.id}
                        className="text-center min-w-[100px] text-xs"
                      >
                        {report.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matrixFilteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="sticky left-0 bg-background z-10">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {getInitials(user.displayName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-sm font-medium">{user.displayName}</span>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      {matrixFilteredReports.map((report) => {
                        const hasAccess = userHasAccess(user.id, report.id);
                        return (
                          <TableCell
                            key={report.id}
                            className="text-center cursor-pointer hover:bg-muted transition-colors"
                            onClick={() => handleToggleAccess(user.id, report.id)}
                          >
                            {hasAccess ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground/20 mx-auto" />
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                  {matrixFilteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={matrixFilteredReports.length + 1}
                        className="text-center py-8"
                      >
                        <p className="text-muted-foreground">ไม่พบผู้ใช้</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-600" />
                <span>มีสิทธิ์</span>
              </div>
              <div className="flex items-center gap-1">
                <X className="h-4 w-4 text-muted-foreground/30" />
                <span>ไม่มีสิทธิ์</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-primary" />
                <span>Admin มีสิทธิ์ทั้งหมดโดยอัตโนมัติ</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Access Management Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {selectedUser ? getInitials(selectedUser.displayName) : ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <div>{selectedUser?.displayName}</div>
                <div className="text-xs font-normal text-muted-foreground">
                  {selectedUser?.email}
                </div>
              </div>
            </SheetTitle>
            <SheetDescription>
              เลือก Reports ที่ผู้ใช้นี้สามารถเข้าถึงได้
            </SheetDescription>
          </SheetHeader>

          {selectedUser && (
            <div className="mt-6 space-y-4">
              {/* Select All */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">เลือกทั้งหมด</span>
                <Switch
                  checked={
                    activeReports.length > 0 &&
                    activeReports.every((r) => userHasAccess(selectedUser.id, r.id))
                  }
                  onCheckedChange={(checked) =>
                    handleSelectAllReports(selectedUser.id, checked)
                  }
                />
              </div>

              {/* Reports List */}
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-2 pr-4">
                  {activeReports.map((report) => {
                    const hasAccess = userHasAccess(selectedUser.id, report.id);
                    return (
                      <div
                        key={report.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                          hasAccess
                            ? "bg-green-50 border-green-200"
                            : "hover:bg-muted"
                        )}
                        onClick={() =>
                          handleToggleAccess(selectedUser.id, report.id)
                        }
                      >
                        <Checkbox
                          checked={hasAccess}
                          onCheckedChange={() =>
                            handleToggleAccess(selectedUser.id, report.id)
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {report.name}
                          </p>
                          {report.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {report.description}
                            </p>
                          )}
                        </div>
                        {hasAccess && (
                          <Check className="h-4 w-4 text-green-600 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Summary */}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  เลือกไว้{" "}
                  <span className="font-semibold text-foreground">
                    {activeReports.filter((r) => userHasAccess(selectedUser.id, r.id)).length}
                  </span>{" "}
                  จาก {activeReports.length} reports
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
