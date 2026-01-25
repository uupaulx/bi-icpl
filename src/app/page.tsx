"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useReportStore } from "@/stores/report-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Users, TrendingUp, FolderOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAuthStore();
  const { reports, menuStructure, loadUserReports } = useReportStore();

  // Load reports when user is available (MainLayout handles auth refresh)
  useEffect(() => {
    if (user) {
      loadUserReports(user.id, user.role);
    }
  }, [user, loadUserReports]);

  // MainLayout handles loading and auth redirect, so user should always exist here
  if (!user) {
    return null;
  }

  const totalReports = reports.length;
  const totalCategories = menuStructure.length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#004F9F]">
            สวัสดี, {user.displayName}
          </h1>
          <p className="text-muted-foreground">
            ยินดีต้อนรับสู่ ICPL × BI Report
          </p>
        </div>
        <Badge variant={user.role === "admin" ? "default" : "secondary"} className="w-fit">
          {user.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports ที่เข้าถึงได้</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">
              รายงานที่คุณมีสิทธิ์ดู
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">หมวดหมู่</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              หมวดหมู่ที่มี Reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">แผนก</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.department || "-"}</div>
            <p className="text-xs text-muted-foreground">
              แผนกของคุณ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สถานะ</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">
              บัญชีของคุณเปิดใช้งานอยู่
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Reports ล่าสุด
            </CardTitle>
            <CardDescription>
              รายงานที่คุณสามารถเข้าถึงได้
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="py-8 text-center">
                <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  ยังไม่มี Report ที่คุณสามารถเข้าถึงได้
                </p>
                <p className="text-xs text-muted-foreground">
                  กรุณาติดต่อ Admin เพื่อขอสิทธิ์การเข้าถึง
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 5).map((report) => (
                  <Link
                    key={report.id}
                    href={`/reports/${report.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{report.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {report.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
                {reports.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    และอีก {reports.length - 5} รายงาน
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              หมวดหมู่
            </CardTitle>
            <CardDescription>
              หมวดหมู่ Reports ที่คุณเข้าถึงได้
            </CardDescription>
          </CardHeader>
          <CardContent>
            {menuStructure.length === 0 ? (
              <div className="py-8 text-center">
                <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  ยังไม่มีหมวดหมู่ที่คุณสามารถเข้าถึงได้
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {menuStructure.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{category.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {category.reports.length} Reports
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Quick Actions */}
      {user.role === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>ทางลัดสำหรับ Admin</CardTitle>
            <CardDescription>
              เข้าถึงฟังก์ชันการจัดการระบบได้อย่างรวดเร็ว
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              <Link href="/admin/reports">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  จัดการ Reports
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full justify-start">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  จัดการหมวดหมู่
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  จัดการผู้ใช้
                </Button>
              </Link>
              <Link href="/admin/access">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  จัดการสิทธิ์
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
