"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useReportStore } from "@/stores/report-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Building2, Calendar, Shield, Clock, FileText, FolderOpen } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { reports, menuStructure, loadUserReports } = useReportStore();

  useEffect(() => {
    if (user) {
      loadUserReports(user.id, user.role);
    }
  }, [user, loadUserReports]);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">โปรไฟล์</h1>
        <p className="text-muted-foreground">
          ข้อมูลบัญชีและสิทธิ์การเข้าถึงของคุณ
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>ข้อมูลผู้ใช้</CardTitle>
            <CardDescription>
              ข้อมูลที่ดึงจาก Microsoft Account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials(user.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="text-xl font-semibold">{user.displayName}</h3>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className="mt-1"
                  >
                    {user.role === "admin" ? (
                      <>
                        <Shield className="mr-1 h-3 w-3" />
                        ผู้ดูแลระบบ
                      </>
                    ) : (
                      "ผู้ใช้งาน"
                    )}
                  </Badge>
                </div>

                <Separator />

                <div className="grid gap-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  {user.department && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{user.department}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      สมาชิกตั้งแต่:{" "}
                      {new Date(user.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {user.lastLogin && (
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>เข้าสู่ระบบล่าสุด: {formatDateTime(user.lastLogin)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>สิทธิ์การเข้าถึง</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Reports</span>
              </div>
              <Badge variant="secondary">{reports.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                <span>หมวดหมู่</span>
              </div>
              <Badge variant="secondary">{menuStructure.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>สถานะ</span>
              </div>
              <Badge variant={user.isActive ? "success" : "destructive"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accessible Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Reports ที่เข้าถึงได้</CardTitle>
          <CardDescription>
            {user.role === "admin"
              ? "ในฐานะ Admin คุณสามารถเข้าถึง Reports ทั้งหมดในระบบ"
              : "รายการ Reports ที่คุณได้รับสิทธิ์ในการเข้าถึง"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {menuStructure.length === 0 ? (
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
            <div className="grid gap-4 md:grid-cols-2">
              {menuStructure.map((category) => (
                <div
                  key={category.id}
                  className="rounded-lg border p-4"
                >
                  <h4 className="font-medium mb-2">{category.name}</h4>
                  <ul className="space-y-1">
                    {category.reports.map((report) => (
                      <li
                        key={report.id}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <FileText className="h-3 w-3" />
                        {report.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
