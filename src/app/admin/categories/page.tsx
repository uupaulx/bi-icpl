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
import { Plus, Pencil, Trash2, TrendingUp, DollarSign, Users, Megaphone, Settings, FileText } from "lucide-react";
import { Category } from "@/types";

const iconOptions = [
  { value: "trending-up", label: "Trending", icon: TrendingUp },
  { value: "dollar-sign", label: "Dollar", icon: DollarSign },
  { value: "users", label: "Users", icon: Users },
  { value: "megaphone", label: "Megaphone", icon: Megaphone },
  { value: "settings", label: "Settings", icon: Settings },
  { value: "file-text", label: "File", icon: FileText },
];

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    reports,
    categories,
    loadAllReports,
    loadAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useReportStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "trending-up",
    sortOrder: 0,
  });

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
      return;
    }
    loadAllReports();
    loadAllCategories();
  }, [user, router, loadAllReports, loadAllCategories]);

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
        icon: category.icon,
        sortOrder: category.sortOrder,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        icon: "trending-up",
        sortOrder: categories.length,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      createCategory(formData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (category: Category) => {
    const reportsInCategory = reports.filter((r) => r.categoryId === category.id);
    if (reportsInCategory.length > 0) {
      alert(`ไม่สามารถลบหมวดหมู่นี้ได้ เนื่องจากมี ${reportsInCategory.length} Reports อยู่`);
      return;
    }
    if (confirm("ต้องการลบหมวดหมู่นี้หรือไม่?")) {
      deleteCategory(category.id);
    }
  };

  const getReportCount = (categoryId: string) => {
    return reports.filter((r) => r.categoryId === categoryId).length;
  };

  const IconComponent = ({ iconName }: { iconName: string }) => {
    const option = iconOptions.find((o) => o.value === iconName);
    const Icon = option?.icon || FileText;
    return <Icon className="h-4 w-4" />;
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">จัดการหมวดหมู่</h1>
          <p className="text-muted-foreground">
            จัดกลุ่ม Reports ตามหมวดหมู่เพื่อความเป็นระเบียบ
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มหมวดหมู่
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
              </DialogTitle>
              <DialogDescription>
                กำหนดชื่อและไอคอนสำหรับหมวดหมู่
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">ชื่อหมวดหมู่ *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="เช่น Sales, Finance, HR"
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
                  placeholder="อธิบายเกี่ยวกับหมวดหมู่นี้"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="icon">ไอคอน</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) =>
                      setFormData({ ...formData, icon: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="h-4 w-4" />
                            {option.label}
                          </div>
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.name}>
                {editingCategory ? "บันทึก" : "เพิ่มหมวดหมู่"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการหมวดหมู่</CardTitle>
          <CardDescription>
            ทั้งหมด {categories.length} หมวดหมู่
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ไอคอน</TableHead>
                <TableHead>ชื่อหมวดหมู่</TableHead>
                <TableHead>คำอธิบาย</TableHead>
                <TableHead>จำนวน Reports</TableHead>
                <TableHead>ลำดับ</TableHead>
                <TableHead className="text-right">การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <IconComponent iconName={category.icon} />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.description || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getReportCount(category.id)} Reports
                      </Badge>
                    </TableCell>
                    <TableCell>{category.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category)}
                          disabled={getReportCount(category.id) > 0}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">ยังไม่มีหมวดหมู่</p>
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
