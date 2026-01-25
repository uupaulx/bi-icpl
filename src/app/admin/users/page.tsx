"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useUserStore } from "@/stores/user-store";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Shield, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { users, loadUsers, updateUserRole, toggleUserActive, getUserReports } = useUserStore();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [userReportCounts, setUserReportCounts] = useState<Record<string, number>>({});

  const loadUserReportCounts = useCallback(async () => {
    const counts: Record<string, number> = {};
    for (const user of users) {
      if (user.role !== "admin") {
        const reports = await getUserReports(user.id);
        counts[user.id] = reports.length;
      }
    }
    setUserReportCounts(counts);
  }, [users, getUserReports]);

  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      router.push("/");
      return;
    }
    loadUsers();
  }, [currentUser, router, loadUsers]);

  useEffect(() => {
    if (users.length > 0) {
      loadUserReportCounts();
    }
  }, [users, loadUserReportCounts]);

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

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

  if (!currentUser || currentUser.role !== "admin") return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">จัดการผู้ใช้</h1>
        <p className="text-muted-foreground">
          ดูรายชื่อผู้ใช้และกำหนด Role
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ค้นหาชื่อ, อีเมล หรือแผนก..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="กรอง Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายชื่อผู้ใช้</CardTitle>
          <CardDescription>
            ทั้งหมด {filteredUsers.length} คน
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ผู้ใช้</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>แผนก</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>เข้าใช้ล่าสุด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const reportCount = userReportCounts[user.id] ?? 0;
                const isCurrentUser = user.id === currentUser.id;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(user.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs">
                              คุณ
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>{user.department || "-"}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value: "admin" | "user") =>
                          handleRoleChange(user.id, value)
                        }
                        disabled={isCurrentUser}
                      >
                        <SelectTrigger className="w-[100px]">
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
                              <User className="h-3 w-3" />
                              User
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.isActive}
                          onCheckedChange={() => handleToggleActive(user.id)}
                          disabled={isCurrentUser}
                        />
                        <Badge
                          variant={user.isActive ? "success" : "secondary"}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge variant="default">ทั้งหมด</Badge>
                      ) : (
                        <Badge variant="secondary">{reportCount}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {user.lastLogin
                        ? formatDateTime(user.lastLogin)
                        : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">ไม่พบผู้ใช้</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
