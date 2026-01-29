"use client";
import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Category } from '@/utils/category';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Upload, X, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';

interface CreateNewsFormProps {
  defaultCategoryId?: number;
  buttonText?: ReactNode;
  buttonClassName?: string;
  onSuccess?: () => void;
}

export default function CreateNewsForm({ defaultCategoryId, buttonText, buttonClassName, onSuccess }: CreateNewsFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    file: null as File | null,
    filePreview: null as string | null,
    category_id: defaultCategoryId ? defaultCategoryId.toString() : '',
    attachments: [] as { name: string; url: string; type: string }[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate category is selected
    if (!formData.category_id) {
      alert('Ангилал сонгоно уу');
      return;
    }
    
    setIsLoading(true);

    try {
      let bannerImageUrl: string | null = null;

      // Зураг upload хийх
      if (formData.file) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.success) {
            bannerImageUrl = uploadData.url;
          }
        }
      }

      // Add attachments to content if any
      let finalContent = formData.content;
      if (formData.attachments.length > 0) {
        finalContent += '<div class="attachments mt-6 p-4 bg-gray-50 rounded-lg"><h4 class="font-semibold mb-3">Хавсралт файлууд:</h4><ul class="space-y-2">';
        formData.attachments.forEach(att => {
          const isPdf = att.type === 'pdf' || att.name.toLowerCase().endsWith('.pdf') || att.url.toLowerCase().includes('.pdf');
          const icon = isPdf ? '📄' : att.type === 'image' ? '🖼️' : '📎';
          // Store as link only; public pages enhance PDFs to inline viewer
          finalContent += `<li><a href="${att.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${icon} ${att.name}</a></li>`;
        });
        finalContent += '</ul></div>';
      }

      // Контент хадгалах
      const contentData = {
        title: formData.title,
        description: formData.description,
        content: finalContent,
        category_id: parseInt(formData.category_id, 10),
        banner_image: bannerImageUrl,
        created_date: new Date().toISOString()
      };

      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Мэдээ оруулахад алдаа гарлаа');
      }

      // Form цэвэрлэх
      setFormData({
        title: '',
        description: '',
        content: '',
        file: null,
        filePreview: null,
        category_id: defaultCategoryId ? defaultCategoryId.toString() : '',
        attachments: []
      });

      // Refresh хийх
      router.refresh();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      alert('Мэдээ амжилттай нэмэгдлээ');
      setOpen(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Алдаа гарлаа: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        file: file,
        filePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setUploadingAttachment(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, {
            name: file.name,
            url: data.url,
            type: data.type
          }]
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Файл оруулахад алдаа гарлаа');
    } finally {
      setUploadingAttachment(false);
      e.target.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Гарчиг */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          Гарчиг <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
          placeholder="Мэдээний гарчиг оруулна уу"
          className="text-lg"
        />
      </div>

      {/* Товч тайлбар */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
          Товч тайлбар <span className="text-red-500">*</span>
        </label>
        <Input
          id="description"
          type="text"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
          placeholder="Мэдээний товч тайлбар оруулна уу"
        />
      </div>

      {/* Ангилал */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Ангилал <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.category_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ангилал сонгоно уу" />
          </SelectTrigger>
          <SelectContent>
            {Category.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.mongolian_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Дэлгэрэнгүй - RichTextEditor */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Дэлгэрэнгүй агуулга <span className="text-red-500">*</span>
        </label>
        <div className="border rounded-xl overflow-hidden">
          <RichTextEditor
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Зураг, PDF файл, холбоос оруулах боломжтой
        </p>
      </div>

      {/* Нүүр зураг */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Нүүр зураг
        </label>
        <div className="space-y-3">
          {formData.filePreview ? (
            <div className="relative inline-block">
              <img 
                src={formData.filePreview} 
                alt="Preview" 
                className="h-32 w-auto rounded-lg object-cover border"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, file: null, filePreview: null }))}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors">
              <div className="text-center">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500">Нүүр зураг сонгох</span>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Хавсралт файлууд */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Хавсралт файлууд (PDF, Зураг)
        </label>
        
        {/* Existing attachments */}
        {formData.attachments.length > 0 && (
          <div className="space-y-2 mb-3">
            {formData.attachments.map((att, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  {att.type === 'pdf' ? (
                    <FileText className="w-5 h-5 text-red-500" />
                  ) : att.type === 'image' ? (
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-500" />
                  )}
                  <span className="text-sm font-medium truncate max-w-[200px]">{att.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Upload button */}
        <label className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors">
          {uploadingAttachment ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span className="text-sm text-gray-600">
            {uploadingAttachment ? 'Оруулж байна...' : 'Файл нэмэх'}
          </span>
          <input
            type="file"
            onChange={handleAttachmentUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
            className="hidden"
            disabled={uploadingAttachment}
          />
        </label>
      </div>

      {/* Submit button */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setOpen(false)}
          disabled={isLoading}
        >
          Цуцлах
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Хадгалж байна...
            </>
          ) : (
            'Нэмэх'
          )}
        </Button>
      </div>
    </form>
  );

  // If buttonText is provided, wrap in dialog
  if (buttonText !== undefined) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className={buttonClassName}>
            {buttonText}
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Шинэ мэдээ нэмэх</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  // Default: return just the form
  return formContent;
}
