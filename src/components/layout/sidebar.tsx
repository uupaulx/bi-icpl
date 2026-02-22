"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useReportStore } from "@/stores/report-store";
import { useUIStore } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronRight,
  ChevronLeft,
  FileText,
  Users,
  FolderOpen,
  Pin,
  PinOff,
  GripVertical,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReportWithPreference } from "@/types";

interface SidebarProps {
  collapsed?: boolean;
}

// Sortable Report Item Component
function SortableReportItem({
  report,
  isActive,
  isExpanded,
  onTogglePin,
}: {
  report: ReportWithPreference;
  isActive: boolean;
  isExpanded: boolean;
  onTogglePin: (e: React.MouseEvent, reportId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: report.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Always show expanded view when isExpanded is true
  if (!isExpanded) {
    // Collapsed mode - show report icons only (no tooltip needed since we have hover expand)
    return (
      <div ref={setNodeRef} style={style}>
        <Link href={`/reports/${report.id}`}>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-center px-2",
              report.isPinned && "bg-amber-50",
              isDragging && "opacity-50"
            )}
          >
            {report.isPinned ? (
              <Pin className="h-4 w-4 text-amber-600" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
          </Button>
        </Link>
      </div>
    );
  }

  // Expanded mode - show full report list with drag handle
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center rounded-md",
        report.isPinned && "bg-amber-50/50",
        isDragging && "opacity-50 bg-muted"
      )}
    >
      {/* Drag Handle */}
      <button
        className="p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Report Link */}
      <Link href={`/reports/${report.id}`} className="flex-1 min-w-0">
        <Button
          variant={isActive ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "w-full justify-start text-sm font-normal",
            isActive && "font-medium"
          )}
        >
          {report.isPinned ? (
            <Pin className="mr-2 h-4 w-4 text-amber-600 shrink-0" />
          ) : (
            <FileText className="mr-2 h-4 w-4 shrink-0" />
          )}
          <span className="truncate">{report.name}</span>
        </Button>
      </Link>

      {/* Pin Toggle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
              report.isPinned && "opacity-100"
            )}
            onClick={(e) => onTogglePin(e, report.id)}
          >
            {report.isPinned ? (
              <PinOff className="h-3.5 w-3.5 text-amber-600" />
            ) : (
              <Pin className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {report.isPinned ? "เลิกปักหมุด" : "ปักหมุด"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const { user } = useAuthStore();
  const { loadUserReports, currentReport, getSortedReports, togglePin, reorderReports } = useReportStore();
  const { toggleSidebar } = useUIStore();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  // Hover state for peek/expand on hover
  const [isHovered, setIsHovered] = useState(false);

  // Setup drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (user) {
      loadUserReports(user.id, user.role);
    }
  }, [user, loadUserReports]);

  // Get sorted reports (pinned first, then by user order)
  const sortedReports = getSortedReports();

  // Filter by search query
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) {
      return sortedReports;
    }
    const query = searchQuery.toLowerCase();
    return sortedReports.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query)
    );
  }, [sortedReports, searchQuery]);

  // Separate pinned and unpinned reports
  const pinnedReports = filteredReports.filter((r) => r.isPinned);
  const unpinnedReports = filteredReports.filter((r) => !r.isPinned);

  const handleTogglePin = async (e: React.MouseEvent, reportId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      await togglePin(user.id, reportId);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !user) return;

    // Find which list the item belongs to (pinned or unpinned)
    const isPinnedItem = pinnedReports.some((r) => r.id === active.id);
    const currentList = isPinnedItem ? pinnedReports : unpinnedReports;

    const oldIndex = currentList.findIndex((r) => r.id === active.id);
    const newIndex = currentList.findIndex((r) => r.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Reorder within the same list
      const newOrder = arrayMove(currentList, oldIndex, newIndex);
      const newReportIds = newOrder.map((r) => r.id);
      await reorderReports(user.id, newReportIds);
    }
  };

  if (!user) return null;

  // isExpanded = true when sidebar is not collapsed OR when hovering over collapsed sidebar
  const isExpanded = !collapsed || isHovered;

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-12 z-30 hidden h-[calc(100vh-3rem)] shrink-0 border-r bg-background md:block transition-all duration-300",
          // Width based on expanded state (not just collapsed)
          isExpanded ? "w-64" : "w-16",
          // Add shadow when hovering on collapsed sidebar for visual feedback
          collapsed && isHovered && "shadow-lg"
        )}
        onMouseEnter={() => collapsed && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Collapse Toggle */}
        <div className="absolute -right-3 top-4 z-40">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full border bg-background shadow-md hover:bg-muted"
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
          <div className={cn("space-y-1", isExpanded ? "px-3" : "px-2")}>
            {/* Search Box - Only show when expanded */}
            {isExpanded && (
              <div className="px-2 pb-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหา Report..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-9"
                  />
                </div>
              </div>
            )}

            {/* Reports Header */}
            {isExpanded && (
              <div className="px-2 py-2">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Reports
                </h4>
              </div>
            )}

            {/* Reports List */}
            {filteredReports.length === 0 ? (
              isExpanded && (
                <div className="px-3 py-8 text-center">
                  {searchQuery ? (
                    <>
                      <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        ไม่พบ Report ที่ค้นหา
                      </p>
                    </>
                  ) : (
                    <>
                      <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        ยังไม่มี Report ที่คุณสามารถเข้าถึงได้
                      </p>
                      <p className="text-xs text-muted-foreground">
                        กรุณาติดต่อ Admin
                      </p>
                    </>
                  )}
                </div>
              )
            ) : (
              <div className="space-y-1">
                {/* Pinned Reports Section */}
                {pinnedReports.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={pinnedReports.map((r) => r.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {pinnedReports.map((report) => (
                        <SortableReportItem
                          key={report.id}
                          report={report}
                          isActive={currentReport?.id === report.id}
                          isExpanded={isExpanded}
                          onTogglePin={handleTogglePin}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}

                {/* Separator between pinned and unpinned */}
                {pinnedReports.length > 0 && unpinnedReports.length > 0 && isExpanded && (
                  <Separator className="my-2" />
                )}

                {/* Unpinned Reports Section */}
                {unpinnedReports.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={unpinnedReports.map((r) => r.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {unpinnedReports.map((report) => (
                        <SortableReportItem
                          key={report.id}
                          report={report}
                          isActive={currentReport?.id === report.id}
                          isExpanded={isExpanded}
                          onTogglePin={handleTogglePin}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            )}

            {/* Admin Section */}
            {user.role === "admin" && (
              <>
                <Separator className="my-4" />
                {isExpanded && (
                  <div className="px-2 py-2">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      จัดการระบบ
                    </h4>
                  </div>
                )}
                <Tooltip open={isExpanded ? false : undefined}>
                  <TooltipTrigger asChild>
                    <Link href="/admin/reports">
                      <Button
                        variant={pathname === "/admin/reports" ? "secondary" : "ghost"}
                        className={cn(
                          "w-full",
                          isExpanded ? "justify-start" : "justify-center px-2"
                        )}
                      >
                        <FileText className={cn("h-4 w-4", isExpanded && "mr-2")} />
                        {isExpanded && "จัดการ Reports"}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">จัดการ Reports</TooltipContent>
                </Tooltip>
                <Tooltip open={isExpanded ? false : undefined}>
                  <TooltipTrigger asChild>
                    <Link href="/admin/users">
                      <Button
                        variant={pathname.startsWith("/admin/users") ? "secondary" : "ghost"}
                        className={cn(
                          "w-full",
                          isExpanded ? "justify-start" : "justify-center px-2"
                        )}
                      >
                        <Users className={cn("h-4 w-4", isExpanded && "mr-2")} />
                        {isExpanded && "จัดการผู้ใช้และสิทธิ์"}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">จัดการผู้ใช้และสิทธิ์</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </ScrollArea>
      </aside>
    </TooltipProvider>
  );
}
