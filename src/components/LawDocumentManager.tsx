'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  ExternalLink, 
  FileText, 
  BookOpen, 
  Gavel,
  Link as LinkIcon,
  Upload,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface LawDocument {
  id: number;
  title: string;
  type: 'law_link' | 'director_order';
  url: string | null;
  file_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface LawDocumentManagerProps {
  type: 'law_link' | 'director_order' | 'procurement_law';
  title: string;
}

export function LawDocumentManager({ type, title }: LawDocumentManagerProps) {
  const [documents, setDocuments] = useState<LawDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<LawDocument | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formFileUrl, setFormFileUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/law-documents?type=${type}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Өгөгдөл татахад алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [type]);

  const resetForm = () => {
    setFormTitle('');
    setFormUrl('');
    setFormFileUrl('');
    setFormDescription('');
    setEditingDoc(null);
  };

  const openEditDialog = (doc: LawDocument) => {
    setEditingDoc(doc);
    setFormTitle(doc.title);
    setFormUrl(doc.url || '');
    setFormFileUrl(doc.file_url || '');
    setFormDescription(doc.description || '');
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Зөвхөн PDF файл оруулна уу');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormFileUrl(data.url);
        toast.success('Файл амжилттай байршлаа');
      } else {
        toast.error('Файл байршуулахад алдаа гарлаа');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Файл байршуулахад алдаа гарлаа');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formTitle) {
      toast.error('Гарчиг оруулна уу');
      return;
    }

    if ((type === 'law_link' || type === 'procurement_law') && !formUrl) {
      toast.error('Холбоос оруулна уу');
      return;
    }

    if (type === 'director_order' && !formFileUrl) {
      toast.error('PDF файл оруулна уу');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formTitle,
        type,
        url: (type === 'law_link' || type === 'procurement_law') ? formUrl : null,
        file_url: type === 'director_order' ? formFileUrl : null,
        description: formDescription || null,
      };

      let response;
      if (editingDoc) {
        response = await fetch(`/api/law-documents/${editingDoc.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/law-documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        toast.success(editingDoc ? 'Амжилттай шинэчлэгдлээ' : 'Амжилттай нэмэгдлээ');
        setIsDialogOpen(false);
        resetForm();
        fetchDocuments();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Алдаа гарлаа');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Алдаа гарлаа');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;

    try {
      const response = await fetch(`/api/law-documents/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Амжилттай устгагдлаа');
        fetchDocuments();
      } else {
        toast.error('Устгахад алдаа гарлаа');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Устгахад алдаа гарлаа');
    }
  };

  const Icon = type === 'director_order' ? Gavel : BookOpen;
  const colorClass = type === 'director_order' ? 'purple' : type === 'procurement_law' ? 'emerald' : 'blue';

  const gradientColor = type === 'director_order' 
    ? 'from-purple-500 to-purple-600' 
    : type === 'procurement_law' 
      ? 'from-emerald-500 to-emerald-600' 
      : 'from-blue-500 to-blue-600';

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className={`bg-gradient-to-r ${gradientColor} text-white`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {title}
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={openAddDialog}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-1" />
                Нэмэх
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingDoc ? 'Засах' : 'Шинээр нэмэх'} - {title}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Гарчиг *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Гарчиг оруулна уу"
                    required
                  />
                </div>

                {(type === 'law_link' || type === 'procurement_law') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Холбоос (URL) *
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={formUrl}
                        onChange={(e) => setFormUrl(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://legalinfo.mn/..."
                        required
                      />
                    </div>
                  </div>
                )}

                {type === 'director_order' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PDF файл *
                    </label>
                    {formFileUrl ? (
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <FileText className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-700 flex-1 truncate">
                          Файл байршсан
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormFileUrl('')}
                          className="text-red-500 hover:text-red-700"
                        >
                          Устгах
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="pdf-upload"
                          disabled={isUploading}
                        />
                        <label
                          htmlFor="pdf-upload"
                          className={`flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                              <span className="text-sm text-gray-600">Байршуулж байна...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-gray-400" />
                              <span className="text-sm text-gray-600">PDF файл сонгох</span>
                            </>
                          )}
                        </label>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тайлбар (заавал биш)
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Нэмэлт тайлбар..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Цуцлах
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-gradient-to-r ${gradientColor}`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Хадгалж байна...
                      </>
                    ) : (
                      editingDoc ? 'Шинэчлэх' : 'Нэмэх'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <div className={`p-2 rounded-lg ${type === 'director_order' ? 'bg-purple-100' : type === 'procurement_law' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                  {type === 'director_order' ? (
                    <FileText className="w-4 h-4 text-purple-600" />
                  ) : type === 'procurement_law' ? (
                    <LinkIcon className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <LinkIcon className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{doc.title}</h4>
                  {doc.description && (
                    <p className="text-xs text-gray-500 truncate">{doc.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(doc.url || doc.file_url) && (
                    <a
                      href={doc.url || doc.file_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => openEditDialog(doc)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Одоогоор бичвэр байхгүй байна</p>
            <Button
              variant="link"
              onClick={openAddDialog}
              className={`mt-2 text-${colorClass}-600`}
            >
              <Plus className="w-4 h-4 mr-1" />
              Шинээр нэмэх
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

