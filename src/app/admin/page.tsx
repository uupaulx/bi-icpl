"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useReportStore } from "@/stores/report-store";
import { useUserStore } from "@/stores/user-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, FolderOpen, Shield, TrendingUp, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { loadAllReports, loadAllCategories, reports, categories } = useReportStore();
  const { loadUsers, loadUserReportAccess, users, userReportAccess } = useUserStore();

  useEffect(() => {
    // Check admin access
    if (user && user.role !== "admin") {
      router.push("/");
      return;
    }

    // Load data
    loadAllReports();
    loadAllCategories();
    loadUsers();
    loadUserReportAccess();
  }, [user, router, loadAllReports, loadAllCategories, loadUsers, loadUserReportAccess]);

  if (!user || user.role !== "admin") return null;

  const activeReports = reports.filter((r) => r.isActive);
  const inactiveReports = reports.filter((r) => !r.isActive);
  const activeUsers = users.filter((u) => u.isActive);
  const adminUsers = users.filter((u) => u.role === "admin");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            ภาพรวมการจัดการระบบ BI Report Portal
          </p>
        </div>
        <Badge variant="default" className="w-fit">
          <Shield className="mr-1 h-3 w-3" />
          ผู้ดูแลระบบ
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports ทั้งหมด</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <div className="flex gap-2 mt-1">
              <Badge variant="success" className="text-xs">
                {activeReports.length} Active
              </Badge>
              {inactiveReports.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {inactiveReports.length} Inactive
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">หมวดหมู่</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              หมวดหมู่ในระบบ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้งาน</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="flex gap-2 mt-1">
              <Badge variant="success" className="text-xs">
                {activeUsers.length} Active
              </Badge>
              <Badge variant="default" className="text-xs">
                {adminUsers.length} Admin
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การกำหนดสิทธิ์</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userReportAccess.length}</div>
            <p className="text-xs text-muted-foreground">
              User-Report Access
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Management Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              การจัดการ
            </CardTitle>
            <CardDescription>
              เข้าถึงฟังก์ชันการจัดการต่างๆ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/reports">
              <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">จัดการ Reports</p>
                    <p className="text-sm text-muted-foreground">
                      เพิ่ม แก้ไข ลบ Reports และ Embed URLs
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>

            <Link href="/admin/categories">
              <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted cursor-pointer">
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">จัดการหมวดหมู่</p>
                    <p className="text-sm text-muted-foreground">
                      จัดกลุ่ม Reports ตามหมวดหมู่
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>

            <Link href="/admin/users">
              <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted cursor-pointer">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">จัดการผู้ใช้</p>
                    <p className="text-sm text-muted-foreground">
                      ดูรายชื่อผู้ใช้และกำหนด Role
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>

            <Link href="/admin/access">
              <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted cursor-pointer">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">จัดการสิทธิ์</p>
                    <p className="text-sm text-muted-foreground">
                      กำหนดสิทธิ์ User-Report Access
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              รายงานล่าสุด
            </CardTitle>
            <CardDescription>
              Reports ที่เพิ่มเข้าระบบล่าสุด
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((report) => {
                  const category = categories.find((c) => c.id === report.categoryId);
                  return (
                    <div
                      key={report.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium text-sm">{report.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {category?.name || "ไม่มีหมวดหมู่"}
                          </Badge>
                          <Badge
                            variant={report.isActive ? "success" : "outline"}
                            className="text-xs"
                          >
                            {report.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString("th-TH")}
                      </span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
