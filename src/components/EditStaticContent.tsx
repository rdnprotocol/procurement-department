'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from './RichTextEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getContentTypeLabel } from '@/utils/contentTypes';

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
  updated_at?: string;
}

interface EditStaticContentProps {
  content: StaticContent;
  onClose?: () => void;
  onSuccess?: () => void;
  showCard?: boolean;
}

export function EditStaticContent({ content, onClose, onSuccess, showCard = false }: EditStaticContentProps) {
  const router = useRouter();
  const [open, setOpen] = useState(!showCard);
  const [editedTitle, setEditedTitle] = useState(content.title);
  const [editedContent, setEditedContent] = useState(content.content);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedTitle(content.title);
    setEditedContent(content.content);
  }, [content]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

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
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Контент шинэчлэхэд алдаа гарлаа');
    } finally {
      setIsSaving(false);
    }
  };

  // Card display mode
  if (showCard) {
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
            {content.updated_at && (
              <div className="text-sm text-gray-500 mt-4">
                Сүүлд шинэчилсэн: {new Date(content.updated_at).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen && onClose) {
            onClose();
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{getContentTypeLabel(content.type)} засах</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Гарчиг</Label>
                <Input
                  id="edit-title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Гарчиг"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Агуулга</Label>
                <RichTextEditor
                  value={editedContent}
                  onChange={setEditedContent}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleClose}>
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

  // Dialog-only mode (for external control)
  return (
    <Dialog open={true} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handleClose();
      }
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getContentTypeLabel(content.type)} засах</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Гарчиг</Label>
            <Input
              id="edit-title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Гарчиг"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Агуулга</Label>
            <RichTextEditor
              value={editedContent}
              onChange={setEditedContent}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleClose}>
            Цуцлах
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Хадгалж байна...' : 'Хадгалах'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
