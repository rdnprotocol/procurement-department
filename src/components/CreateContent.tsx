"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useFormik } from "formik";
import * as Yup from "yup";
import NextImage from "next/image";
import { Category } from "@/utils/category";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  CalendarIcon,
  FileText,
  Image,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface contentItemValues {
  text: string;
  image: string;
  file_type: "image" | "pdf" | null;
}

interface createContentValues {
  title: string;
  banner_image: string;
  created_date: Date;
  category_id: number;
  items: contentItemValues[];
}

export const CreateContent = () => {
  const createContentSchema = Yup.object().shape({
    title: Yup.string().required("Гарчиг шаардлагатай"),
    banner_image: Yup.string().required("Баннер зураг шаардлагатай"),
    created_date: Yup.date().required("Үүсгэсэн огноо шаардлагатай"),
    category_id: Yup.number().required("Ангилал ID шаардлагатай"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          text: Yup.string(),
          file: Yup.string(),
        })
      )
      .min(1, "Дор хаяж нэг элемент шаардлагатай"),
  });

  const createContentForm = useFormik<createContentValues>({
    initialValues: {
      title: "",
      banner_image: "",
      created_date: new Date(),
      category_id: 1,
      items: [],
    },
    validationSchema: createContentSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to submit content:", errorData);
          return;
        }

        const result = await response.json();
        console.log("Content submitted successfully:", result);
        createContentForm.resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const addItem = () => {
    const newItems = [
      ...createContentForm.values.items,
      { text: "", image: "" },
    ];
    createContentForm.setFieldValue("items", newItems);
  };

  const removeItem = (index: number) => {
    const newItems = createContentForm.values.items.filter(
      (_, i) => i !== index
    );
    createContentForm.setFieldValue("items", newItems);
  };

  const handleFileUpload = async (
    field: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message || "Upload failed");
      }

      createContentForm.setFieldValue(field, result.url);
    } catch (error) {
      console.error("File upload error:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const handleItemFileUpload = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message || "Upload failed");
      }

      const newItems = [...createContentForm.values.items];
      newItems[index] = {
        ...newItems[index],
        image: result.url,
        file_type: result.type,
      };
      createContentForm.setFieldValue("items", newItems);
    } catch (error) {
      console.error("File upload error:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    };
  };

  const getFileIcon = (fileType: "image" | "pdf" | null) => {
    if (fileType === "pdf") return <FileText className="w-4 h-4" aria-label="PDF file" />;
    if (fileType === "image") return <Image className="w-4 h-4" aria-label="Image file" />;
    return <Upload className="w-4 h-4" aria-label="Upload file" />;
  };

  const getFileTypeText = (fileType: "image" | "pdf" | null) => {
    if (fileType === "pdf") return "PDF файл сонгогдсон";
    if (fileType === "image") return "Зураг сонгогдсон";
    return null;
  };

  const updateItemText = (index: number, value: string) => {
    const newItems = [...createContentForm.values.items];
    newItems[index] = { ...newItems[index], text: value };
    createContentForm.setFieldValue("items", newItems);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Нэмэх
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Контент нэмэх
          </DialogTitle>
          <DialogDescription>
            Та шинэ контентын мэдээллийг бөглөнө үү.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={createContentForm.handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Гарчиг *
            </Label>
            <Input
              id="title"
              name="title"
              value={createContentForm.values.title}
              onChange={createContentForm.handleChange}
              onBlur={createContentForm.handleBlur}
              placeholder="Контентийн гарчиг"
              className={cn(
                createContentForm.touched.title &&
                  createContentForm.errors.title
                  ? "border-red-500"
                  : ""
              )}
            />
            {createContentForm.touched.title &&
              createContentForm.errors.title && (
                <p className="text-sm text-red-500">
                  {createContentForm.errors.title}
                </p>
              )}
          </div>

          {/* Banner Image */}
          <div className="space-y-2">
            <Label htmlFor="banner_image" className="text-sm font-medium">
              Баннер зураг *
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="banner_image"
                name="banner_image"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload("banner_image", e)}
                onBlur={createContentForm.handleBlur}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("banner_image")?.click()}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Зураг сонгох
              </Button>
              {createContentForm.values.banner_image && (
                <span className="text-sm text-green-600">Зураг сонгогдсон</span>
              )}
            </div>
            {createContentForm.touched.banner_image &&
              createContentForm.errors.banner_image && (
                <p className="text-sm text-red-500">
                  {createContentForm.errors.banner_image}
                </p>
              )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category_id" className="text-sm font-medium">
              Ангилал *
            </Label>
            <Select
              onValueChange={(value) =>
                createContentForm.setFieldValue("category_id", Number(value))
              }
              value={createContentForm.values.category_id.toString()}
            >
              <SelectTrigger id="category_id">
                <SelectValue placeholder="Ангилал сонгох" />
              </SelectTrigger>
              <SelectContent>
                {Category.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.mongolian_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Үүсгэсэн огноо *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !createContentForm.values.created_date &&
                      "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {createContentForm.values.created_date ? (
                    format(createContentForm.values.created_date, "PPP")
                  ) : (
                    <span>Огноо сонгох</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={createContentForm.values.created_date}
                  onSelect={(date) =>
                    createContentForm.setFieldValue("created_date", date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Контентийн элементүүд *
              </Label>
              <Button
                type="button"
                onClick={addItem}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Элемент нэмэх
              </Button>
            </div>

            {createContentForm.values.items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Контентийн элемент нэмэх товчийг дарж эхлээрэй</p>
              </div>
            )}

            <div className="space-y-4">
              {createContentForm.values.items.map((item, index) => (
                <Card key={index} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        Элемент {index + 1}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Текст</Label>
                      <Textarea
                        value={item.text}
                        onChange={(e) => updateItemText(index, e.target.value)}
                        placeholder="Элементийн текст"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Файл (Зураг эсвэл PDF)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleItemFileUpload(index, e)}
                          className="hidden"
                          id={`item-file-${index}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document
                              .getElementById(`item-file-${index}`)
                              ?.click()
                          }
                          className="gap-2"
                        >
                          {getFileIcon(item.file_type)}
                          Файл сонгох
                        </Button>
                        {item.image && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-green-600">
                              {getFileTypeText(item.file_type)}
                            </span>
                            {item.file_type === "image" && (
                              <div className="w-10 h-10 rounded border overflow-hidden">
                                <NextImage
                                  src={item.image}
                                  alt="Preview"
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            {item.file_type === "pdf" && (
                              <div className="w-10 h-10 rounded border bg-red-50 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {createContentForm.touched.items &&
              createContentForm.errors.items && (
                <p className="text-sm text-red-500">
                  {typeof createContentForm.errors.items === "string"
                    ? createContentForm.errors.items
                    : "Элементүүдийн мэдээлэл буруу байна"}
                </p>
              )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <DialogTrigger asChild>
              <Button type="button" variant="outline">
                Цуцлах
              </Button>
            </DialogTrigger>
            <Button
              type="submit"
              disabled={createContentForm.isSubmitting}
              className="min-w-[100px]"
            >
              {createContentForm.isSubmitting ? "Хадгалж байна..." : "Хадгалах"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
