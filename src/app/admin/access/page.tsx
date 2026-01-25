"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useReportStore } from "@/stores/report-store";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Shield, Check, X } from "lucide-react";

export default function AdminAccessPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { reports, categories, loadAllReports, loadAllCategories } = useReportStore();
  const {
    users,
    userReportAccess,
    loadUsers,
    loadUserReportAccess,
    grantAccess,
    revokeAccess,
    getUserReports,
    getReportUsers,
  } = useUserStore();

  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [userSearch, setUserSearch] = useState("");
  const [reportSearch, setReportSearch] = useState("");

  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      router.push("/");
      return;
    }
    loadAllReports();
    loadAllCategories();
    loadUsers();
    loadUserReportAccess();
  }, [currentUser, router, loadAllReports, loadAllCategories, loadUsers, loadUserReportAccess]);

  const activeReports = reports.filter((r) => r.isActive);
  const regularUsers = users.filter((u) => u.role === "user" && u.isActive);

  const filteredUsers = regularUsers.filter(
    (u) =>
      u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredReports = activeReports.filter(
    (r) =>
      r.name.toLowerCase().includes(reportSearch.toLowerCase()) ||
      r.description?.toLowerCase().includes(reportSearch.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
  };

  const userHasAccess = (userId: string, reportId: string) => {
    return userReportAccess.some(
      (a) => a.userId === userId && a.reportId === reportId
    );
  };

  if (!currentUser || currentUser.role !== "admin") return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">จัดการสิทธิ์การเข้าถึง</h1>
        <p className="text-muted-foreground">
          กำหนดว่า User ไหนสามารถเห็น Report ใด
        </p>
      </div>

      <Tabs defaultValue="by-user" className="space-y-6">
        <TabsList>
          <TabsTrigger value="by-user">จัดการตามผู้ใช้</TabsTrigger>
          <TabsTrigger value="by-report">จัดการตาม Report</TabsTrigger>
          <TabsTrigger value="matrix">ตาราง Access Matrix</TabsTrigger>
        </TabsList>

        {/* By User Tab */}
        <TabsContent value="by-user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>เลือกผู้ใช้</CardTitle>
              <CardDescription>
                เลือกผู้ใช้เพื่อกำหนด Reports ที่สามารถเข้าถึงได้
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกผู้ใช้..." />
                </SelectTrigger>
                <SelectContent>
                  {regularUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <span>{user.displayName}</span>
                        <span className="text-muted-foreground">
                          ({user.email})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedUser && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Reports สำหรับ{" "}
                  {users.find((u) => u.id === selectedUser)?.displayName}
                </CardTitle>
                <CardDescription>
                  เลือก Reports ที่ผู้ใช้นี้สามารถเข้าถึงได้
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => {
                    const categoryReports = activeReports.filter(
                      (r) => r.categoryId === category.id
                    );
                    if (categoryReports.length === 0) return null;

                    return (
                      <div key={category.id}>
                        <h4 className="font-medium mb-2">{category.name}</h4>
                        <div className="space-y-2 pl-4">
                          {categoryReports.map((report) => {
                            const hasAccess = userHasAccess(
                              selectedUser,
                              report.id
                            );
                            return (
                              <div
                                key={report.id}
                                className="flex items-center gap-3"
                              >
                                <Checkbox
                                  checked={hasAccess}
                                  onCheckedChange={() =>
                                    handleToggleAccess(selectedUser, report.id)
                                  }
                                />
                                <span className="text-sm">{report.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* By Report Tab */}
        <TabsContent value="by-report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>เลือก Report</CardTitle>
              <CardDescription>
                เลือก Report เพื่อกำหนดผู้ใช้ที่สามารถเข้าถึงได้
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือก Report..." />
                </SelectTrigger>
                <SelectContent>
                  {activeReports.map((report) => {
                    const category = categories.find(
                      (c) => c.id === report.categoryId
                    );
                    return (
                      <SelectItem key={report.id} value={report.id}>
                        <div className="flex items-center gap-2">
                          <span>{report.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {category?.name}
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedReport && (
            <Card>
              <CardHeader>
                <CardTitle>
                  ผู้ใช้สำหรับ{" "}
                  {reports.find((r) => r.id === selectedReport)?.name}
                </CardTitle>
                <CardDescription>
                  เลือกผู้ใช้ที่สามารถเข้าถึง Report นี้ได้
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {regularUsers.map((user) => {
                    const hasAccess = userHasAccess(user.id, selectedReport);
                    return (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                      >
                        <Checkbox
                          checked={hasAccess}
                          onCheckedChange={() =>
                            handleToggleAccess(user.id, selectedReport)
                          }
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(user.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {user.displayName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-auto">
                          {user.department}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Matrix Tab */}
        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Matrix</CardTitle>
              <CardDescription>
                ภาพรวมสิทธิ์การเข้าถึงทั้งหมด (คลิกเพื่อเปลี่ยนสถานะ)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาผู้ใช้..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหา Report..."
                    value={reportSearch}
                    onChange={(e) => setReportSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="overflow-auto max-h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">
                        ผู้ใช้
                      </TableHead>
                      {filteredReports.slice(0, 10).map((report) => (
                        <TableHead
                          key={report.id}
                          className="text-center min-w-[100px]"
                        >
                          <div className="text-xs">{report.name}</div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.slice(0, 15).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="sticky left-0 bg-background">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {getInitials(user.displayName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{user.displayName}</span>
                          </div>
                        </TableCell>
                        {filteredReports.slice(0, 10).map((report) => {
                          const hasAccess = userHasAccess(user.id, report.id);
                          return (
                            <TableCell
                              key={report.id}
                              className="text-center cursor-pointer hover:bg-muted"
                              onClick={() =>
                                handleToggleAccess(user.id, report.id)
                              }
                            >
                              {hasAccess ? (
                                <Check className="h-4 w-4 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>= มีสิทธิ์</span>
                </div>
                <div className="flex items-center gap-1">
                  <X className="h-4 w-4 text-muted-foreground/30" />
                  <span>= ไม่มีสิทธิ์</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Admin มีสิทธิ์ดู Reports ทั้งหมดโดยอัตโนมัติ</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
