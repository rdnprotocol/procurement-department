'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from './RichTextEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
  updated_at: string;
}

interface ContentCardProps {
  content: StaticContent;
  onUpdate: () => void;
}

function ContentCard({ content, onUpdate }: ContentCardProps) {
  const [open, setOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(content.title);
  const [editedContent, setEditedContent] = useState(content.content);
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when content changes
  useEffect(() => {
    setEditedTitle(content.title);
    setEditedContent(content.content);
  }, [content]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/static-content/${content.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update content');
      }

      setOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Контент шинэчлэхэд алдаа гарлаа');
    } finally {
      setIsSaving(false);
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'mission':
        return 'Эрхэм зорилго';
      case 'vision':
        return 'Алсын харалт';
      case 'goal':
        return 'Стратегийн зорилтууд';
      case 'history':
        return 'Түүхэн замнал';
      case 'structure':
        return 'Бүтэц, зохион байгуулалт';
      case 'intro':
        return 'Байгууллагын танилцуулга';
      default:
        return type;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{content.title}</span>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Засах
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {getContentTypeLabel(content.type)}
            </span>
          </div>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />
          <div className="text-sm text-gray-500 mt-4">
            Сүүлд шинэчилсэн: {new Date(content.updated_at).toLocaleString('mn-MN')}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getContentTypeLabel(content.type)} засах</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Гарчиг</Label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Гарчиг оруулна уу"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Агуулга</Label>
              <RichTextEditor
                value={editedContent}
                onChange={setEditedContent}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Цуцлах
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Хадгалж байна...' : 'Хадгалах'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { ContentCard };