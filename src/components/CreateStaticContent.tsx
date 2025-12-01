'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from './RichTextEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';

interface CreateStaticContentProps {
  onSuccess: () => void;
}

export function CreateStaticContent({ onSuccess }: CreateStaticContentProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!title || !type) {
      alert('Гарчиг болон төрөл оруулна уу');
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch('/api/static-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          type,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Алдаа гарлаа');
      }

      setOpen(false);
      setTitle('');
      setContent('');
      setType('');
      onSuccess();
    } catch (error) {
      console.error('Error creating static content:', error);
      alert(error instanceof Error ? error.message : 'Контент үүсгэхэд алдаа гарлаа');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Шинэ контент нэмэх
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Шинэ статик контент үүсгэх</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="type">Төрөл *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Төрөл сонгоно уу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mission">Эрхэм зорилго</SelectItem>
                <SelectItem value="vision">Алсын харалт</SelectItem>
                <SelectItem value="goal">Стратегийн зорилтууд</SelectItem>
                <SelectItem value="history">Түүхэн замнал</SelectItem>
                <SelectItem value="structure">Бүтэц, зохион байгуулалт</SelectItem>
                <SelectItem value="intro">Байгууллагын танилцуулга</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Гарчиг *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Гарчиг оруулна уу"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Агуулга</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Цуцлах
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving || !title || !type}>
            {isSaving ? 'Хадгалж байна...' : 'Үүсгэх'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


