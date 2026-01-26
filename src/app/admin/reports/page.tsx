"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useReportStore } from "@/stores/report-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, ExternalLink, Loader2, Info } from "lucide-react";
import { Report } from "@/types";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AdminReportsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    reports,
    loadAllReports,
    createReport,
    updateReport,
    deleteReport,
  } = useReportStore();

  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state (removed sortOrder - now auto-sorted by user preferences)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    embedUrl: "",
    isActive: true,
  });

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
      return;
    }
    loadAllReports();
  }, [user, router, loadAllReports]);

  // Sort reports by name for admin view
  const filteredReports = reports
    .filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name, "th"));

  const handleOpenDialog = (report?: Report) => {
    if (report) {
      setEditingReport(report);
      setFormData({
        name: report.name,
        description: report.description || "",
        embedUrl: report.embedUrl,
        isActive: report.isActive,
      });
    } else {
      setEditingReport(null);
      setFormData({
        name: "",
        description: "",
        embedUrl: "",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      if (editingReport) {
        await updateReport(editingReport.id, formData);
        toast.success("บันทึกสำเร็จ", { description: `แก้ไข "${formData.name}" เรียบร้อยแล้ว` });
      } else {
        await createReport({
          ...formData,
          categoryId: "", // Keep for DB compatibility
          sortOrder: 0, // Default value, not used anymore
          createdBy: user.id,
        });
        toast.success("เพิ่มสำเร็จ", { description: `เพิ่ม "${formData.name}" เรียบร้อยแล้ว` });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด", { description: "ไม่สามารถบันทึกข้อมูลได้" });
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`ต้องการลบ "${name}" หรือไม่?`)) return;

    setDeletingId(id);
    try {
      await deleteReport(id);
      toast.success("ลบสำเร็จ", { description: `ลบ "${name}" เรียบร้อยแล้ว` });
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด", { description: "ไม่สามารถลบได้" });
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">จัดการ Reports</h1>
            <p className="text-muted-foreground">
              เพิ่ม แก้ไข หรือลบ Power BI Reports
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                เพิ่ม Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingReport ? "แก้ไข Report" : "เพิ่ม Report ใหม่"}
                </DialogTitle>
                <DialogDescription>
                  กรอกข้อมูล Report และ Power BI Embed URL
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">ชื่อ Report *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="เช่น ยอดขายรายวัน"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">คำอธิบาย</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="อธิบายเกี่ยวกับ Report นี้"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="embedUrl">Power BI Embed URL *</Label>
                  <Textarea
                    id="embedUrl"
                    value={formData.embedUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, embedUrl: e.target.value })
                    }
                    placeholder="https://app.powerbi.com/view?r=..."
                    className="font-mono text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                  <Label htmlFor="isActive">เปิดใช้งาน</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.embedUrl || isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingReport ? "บันทึก" : "เพิ่ม Report"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info banner about sorting */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">ระบบเรียงลำดับอัตโนมัติ</p>
                <p className="text-blue-600">
                  Reports จะเรียงตามความถี่การใช้งานของแต่ละผู้ใช้
                  และผู้ใช้สามารถปักหมุด Report ที่ใช้บ่อยไว้ด้านบนได้เอง
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ค้นหา Report..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายการ Reports</CardTitle>
            <CardDescription>
              ทั้งหมด {filteredReports.length} รายการ (เรียงตามชื่อ ก-ฮ)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อ Report</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => {
                  return (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{report.name}</p>
                          {report.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {report.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={report.isActive ? "success" : "outline"}
                        >
                          {report.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                              >
                                <a
                                  href={report.embedUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>เปิด Report</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenDialog(report)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>แก้ไข</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(report.id, report.name)}
                                disabled={deletingId === report.id}
                              >
                                {deletingId === report.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>ลบ</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredReports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <p className="text-muted-foreground">ไม่พบ Report</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
