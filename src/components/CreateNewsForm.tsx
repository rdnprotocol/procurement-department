"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/utils/category';

export default function CreateNewsForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    file: null as File | null,
    category_id: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Form data үүсгэх
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('content', formData.content);
      form.append('category_id', formData.category_id);
      if (formData.file) {
        form.append('file', formData.file);
      }

      // API руу хүсэлт илгээх
      const response = await fetch('/api/content', {
        method: 'POST',
        body: form
      });

      if (!response.ok) {
        throw new Error('Мэдээ оруулахад алдаа гарлаа');
      }

      // Form цэвэрлэх
      setFormData({
        title: '',
        description: '',
        content: '',
        file: null,
        category_id: ''
      });

      // Refresh хийх
      router.refresh();
      
      alert('Мэдээ амжилттай нэмэгдлээ');
    } catch (error) {
      console.error('Error:', error);
      alert('Алдаа гарлаа: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Гарчиг
        </label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Товч тайлбар
        </label>
        <Input
          id="description"
          type="text"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Дэлгэрэнгүй
        </label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          required
          className="mt-1"
          rows={6}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ангилал
        </label>
        <Select
          value={formData.category_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
        >
          <SelectTrigger className="mt-1">
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

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Зураг
        </label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="mt-1"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Илгээж байна...' : 'Нэмэх'}
      </Button>
    </form>
  );
}