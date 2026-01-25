"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useReportStore } from "@/stores/report-store";
import { useUIStore } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  Megaphone,
  Settings,
  LayoutDashboard,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  "trending-up": TrendingUp,
  "dollar-sign": DollarSign,
  users: Users,
  megaphone: Megaphone,
  settings: Settings,
};

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const { user } = useAuthStore();
  const {
    menuStructure,
    expandedCategories,
    loadUserReports,
    toggleCategory,
    currentReport,
  } = useReportStore();
  const { toggleSidebar } = useUIStore();
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      loadUserReports(user.id, user.role);
    }
  }, [user, loadUserReports]);

  if (!user) return null;

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-12 z-30 hidden h-[calc(100vh-3rem)] shrink-0 border-r bg-white md:block transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Collapse Toggle */}
        <div className="absolute -right-3 top-4 z-40">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full border bg-white shadow-md hover:bg-muted"
            onClick={toggleSidebar}
          >
            {collapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        </div>

        <ScrollArea className="h-full py-4">
          <div className={cn("space-y-1", collapsed ? "px-2" : "px-3")}>
            {/* Dashboard Link */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/">
                  <Button
                    variant={pathname === "/" ? "secondary" : "ghost"}
                    className={cn(
                      "w-full",
                      collapsed ? "justify-center px-2" : "justify-start"
                    )}
                  >
                    <LayoutDashboard className={cn("h-4 w-4", !collapsed && "mr-2")} />
                    {!collapsed && "หน้าแรก"}
                  </Button>
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">หน้าแรก</TooltipContent>}
            </Tooltip>

            <Separator className="my-4" />

            {/* Report Categories */}
            {menuStructure.length === 0 ? (
              !collapsed && (
                <div className="px-3 py-8 text-center">
                  <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    ยังไม่มี Report ที่คุณสามารถเข้าถึงได้
                  </p>
                  <p className="text-xs text-muted-foreground">
                    กรุณาติดต่อ Admin
                  </p>
                </div>
              )
            ) : collapsed ? (
              // Collapsed mode - show only category icons
              <div className="space-y-1">
                {menuStructure.map((category) => {
                  const Icon = iconMap[category.icon] || FileText;
                  return (
                    <Tooltip key={category.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-center px-2"
                          onClick={() => toggleCategory(category.id)}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="flex flex-col gap-1">
                        <span className="font-medium">{category.name}</span>
                        {category.reports.map((report) => (
                          <Link key={report.id} href={`/reports/${report.id}`}>
                            <span className="text-xs hover:underline">{report.name}</span>
                          </Link>
                        ))}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ) : (
              // Expanded mode - show full menu
              <div className="space-y-1">
                {menuStructure.map((category) => {
                  const Icon = iconMap[category.icon] || FileText;
                  const isExpanded = expandedCategories.has(category.id);

                  return (
                    <Collapsible
                      key={category.id}
                      open={isExpanded}
                      onOpenChange={() => toggleCategory(category.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between font-medium"
                        >
                          <span className="flex items-center">
                            <Icon className="mr-2 h-4 w-4" />
                            {category.name}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 pl-4">
                        {category.reports.map((report) => {
                          const isActive = currentReport?.id === report.id;
                          return (
                            <Link
                              key={report.id}
                              href={`/reports/${report.id}`}
                            >
                              <Button
                                variant={isActive ? "secondary" : "ghost"}
                                size="sm"
                                className={cn(
                                  "w-full justify-start pl-6 text-sm font-normal",
                                  isActive && "font-medium"
                                )}
                              >
                                <FileText className="mr-2 h-3 w-3" />
                                {report.name}
                              </Button>
                            </Link>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            )}

            {/* Admin Section */}
            {user.role === "admin" && (
              <>
                <Separator className="my-4" />
                {!collapsed && (
                  <div className="px-2 py-2">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      จัดการระบบ
                    </h4>
                  </div>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin">
                      <Button
                        variant={pathname === "/admin" ? "secondary" : "ghost"}
                        className={cn(
                          "w-full",
                          collapsed ? "justify-center px-2" : "justify-start"
                        )}
                      >
                        <LayoutDashboard className={cn("h-4 w-4", !collapsed && "mr-2")} />
                        {!collapsed && "Admin Dashboard"}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">Admin Dashboard</TooltipContent>}
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/reports">
                      <Button
                        variant={pathname === "/admin/reports" ? "secondary" : "ghost"}
                        className={cn(
                          "w-full",
                          collapsed ? "justify-center px-2" : "justify-start"
                        )}
                      >
                        <FileText className={cn("h-4 w-4", !collapsed && "mr-2")} />
                        {!collapsed && "จัดการ Reports"}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">จัดการ Reports</TooltipContent>}
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/categories">
                      <Button
                        variant={pathname === "/admin/categories" ? "secondary" : "ghost"}
                        className={cn(
                          "w-full",
                          collapsed ? "justify-center px-2" : "justify-start"
                        )}
                      >
                        <FolderOpen className={cn("h-4 w-4", !collapsed && "mr-2")} />
                        {!collapsed && "จัดการหมวดหมู่"}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">จัดการหมวดหมู่</TooltipContent>}
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/users">
                      <Button
                        variant={pathname === "/admin/users" ? "secondary" : "ghost"}
                        className={cn(
                          "w-full",
                          collapsed ? "justify-center px-2" : "justify-start"
                        )}
                      >
                        <Users className={cn("h-4 w-4", !collapsed && "mr-2")} />
                        {!collapsed && "จัดการผู้ใช้"}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">จัดการผู้ใช้</TooltipContent>}
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/access">
                      <Button
                        variant={pathname === "/admin/access" ? "secondary" : "ghost"}
                        className={cn(
                          "w-full",
                          collapsed ? "justify-center px-2" : "justify-start"
                        )}
                      >
                        <Settings className={cn("h-4 w-4", !collapsed && "mr-2")} />
                        {!collapsed && "จัดการสิทธิ์"}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">จัดการสิทธิ์</TooltipContent>}
                </Tooltip>
              </>
            )}
          </div>
        </ScrollArea>
      </aside>
    </TooltipProvider>
  );
}
