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
import { Plus, Pencil, Trash2, Search, ExternalLink, Loader2 } from "lucide-react";
import { Report } from "@/types";
import { toast } from "sonner";

export default function AdminReportsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    reports,
    categories,
    loadAllReports,
    loadAllCategories,
    createReport,
    updateReport,
    deleteReport,
  } = useReportStore();

  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    embedUrl: "",
    categoryId: "",
    sortOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
      return;
    }
    loadAllReports();
    loadAllCategories();
  }, [user, router, loadAllReports, loadAllCategories]);

  const filteredReports = reports.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (report?: Report) => {
    if (report) {
      setEditingReport(report);
      setFormData({
        name: report.name,
        description: report.description || "",
        embedUrl: report.embedUrl,
        categoryId: report.categoryId,
        sortOrder: report.sortOrder,
        isActive: report.isActive,
      });
    } else {
      setEditingReport(null);
      setFormData({
        name: "",
        description: "",
        embedUrl: "",
        categoryId: categories[0]?.id || "",
        sortOrder: 0,
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">หมวดหมู่ *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sortOrder">ลำดับ</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sortOrder: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
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
                disabled={!formData.name || !formData.embedUrl || !formData.categoryId || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingReport ? "บันทึก" : "เพิ่ม Report"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
            ทั้งหมด {filteredReports.length} รายการ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ Report</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>ลำดับ</TableHead>
                <TableHead className="text-right">การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => {
                const category = categories.find(
                  (c) => c.id === report.categoryId
                );
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
                      <Badge variant="secondary">
                        {category?.name || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={report.isActive ? "success" : "outline"}
                      >
                        {report.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(report)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
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
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">ไม่พบ Report</p>
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
