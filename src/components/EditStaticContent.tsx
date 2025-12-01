'use client';

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from './RichTextEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
  updated_at: string;
}

interface EditStaticContentProps {
  content: StaticContent;
}

export function EditStaticContent({ content }: EditStaticContentProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(content.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/static-content/${content.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update content');
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Контент шинэчлэхэд алдаа гарлаа');
    } finally {
      setIsSaving(false);
    }
  };

  const getContentTypeTitle = (type: string) => {
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
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />
          <div className="text-sm text-gray-500 mt-4">
            Сүүлд шинэчилсэн: {new Date(content.updated_at).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{getContentTypeTitle(content.type)} засах</DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <RichTextEditor
                value={editedContent}
                onChange={setEditedContent}
              />
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
      )}
    </>
  );
}