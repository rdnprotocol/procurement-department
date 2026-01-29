'use client';

import { useState, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from './RichTextEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Plus } from 'lucide-react';
import { getContentTypesByGroup, ContentType } from '@/utils/contentTypes';

interface CreateStaticContentProps {
  onSuccess: () => void;
  defaultType?: string;
  buttonText?: ReactNode;
  buttonClassName?: string;
  availableTypes?: ContentType[];
}

export function CreateStaticContent({ onSuccess, defaultType, buttonText, buttonClassName, availableTypes }: CreateStaticContentProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<string>(defaultType || '');
  const [isSaving, setIsSaving] = useState(false);

  const contentTypesByGroup = getContentTypesByGroup();

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
      setType(defaultType || '');
      onSuccess();
    } catch (error) {
      console.error('Error creating static content:', error);
      alert(error instanceof Error ? error.message : 'Контент үүсгэхэд алдаа гарлаа');
    } finally {
      setIsSaving(false);
    }
  };

  // Use available types if provided, otherwise use all types by group
  const renderSelectContent = () => {
    if (availableTypes && availableTypes.length > 0) {
      return availableTypes.map((t) => (
        <SelectItem key={t.value} value={t.value}>
          {t.label}
        </SelectItem>
      ));
    }

    return Object.entries(contentTypesByGroup).map(([group, types]) => (
      <SelectGroup key={group}>
        <SelectLabel className="text-xs font-semibold text-gray-500 uppercase">{group}</SelectLabel>
        {types.map((t) => (
          <SelectItem key={t.value} value={t.value}>
            {t.label}
          </SelectItem>
        ))}
      </SelectGroup>
    ));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonText ? (
          <button className={buttonClassName}>
            {buttonText}
          </button>
        ) : (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Шинэ контент нэмэх
          </Button>
        )}
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
              <SelectContent className="max-h-80">
                {renderSelectContent()}
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


