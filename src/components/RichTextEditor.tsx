'use client';

import dynamic from 'next/dynamic';
import type { ComponentPropsWithoutRef } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { Upload, FileText, Image as ImageIcon, Link as LinkIcon, X, Loader2 } from 'lucide-react';
import { normalizeHtmlForEditor, normalizeHtmlForStorage } from '@/utils/editorHtml';

type ReactQuillComponent = typeof import('react-quill-new').default;
type ReactQuillRef = InstanceType<ReactQuillComponent>;
type ReactQuillProps = ComponentPropsWithoutRef<ReactQuillComponent>;

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false }) as unknown as React.ComponentType<
  ReactQuillProps & React.RefAttributes<ReactQuillRef>
>;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuillRef | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<'image' | 'file'>('image');

  // Keep the editor stable by stripping PDF iframes to links for editing.
  const editorValue = useMemo(() => normalizeHtmlForEditor(value), [value]);

  // Custom image handler
  const imageHandler = useCallback(() => {
    setUploadType('image');
    setShowUploadModal(true);
    setUploadError(null);
  }, []);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (uploadType === 'image') {
      if (!file.type.startsWith('image/')) {
        setUploadError('Зөвхөн зураг файл сонгоно уу');
        return;
      }
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Файл оруулахад алдаа гарлаа');
      }

      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection(true);
        
        if (uploadType === 'image') {
          // Insert image
          quill.insertEmbed(range.index, 'image', result.url);
          quill.setSelection(range.index + 1);
        } else {
          const fileName = file.name;
          const isPdf =
            file.type === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');

          if (isPdf) {
            // Store PDFs as simple links; public pages enhance to inline viewer
            const fileIcon = '📄';
            quill.insertText(range.index, `${fileIcon} ${fileName}`, 'link', result.url);
            quill.setSelection(range.index + fileName.length + 3);
          } else {
            // Insert file link
            const fileIcon = '📎';
            quill.insertText(range.index, `${fileIcon} ${fileName}`, 'link', result.url);
            quill.setSelection(range.index + fileName.length + 3);
          }
        }
      }

      setShowUploadModal(false);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Алдаа гарлаа');
    } finally {
      setUploading(false);
    }
  };

  // Insert link
  const handleInsertLink = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const url = prompt('Холбоосын URL оруулна уу:');
    if (!url) return;

    const text = prompt('Холбоосын текст оруулна уу:', url);
    if (!text) return;

    const range = quill.getSelection(true);
    quill.insertText(range.index, text, 'link', url);
    quill.setSelection(range.index + text.length);
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        // Keep the toolbar simple: PDFs are inserted via our custom button (as links),
        // and we don't support generic "video" embeds in admin content.
        ['link', 'image'],
        ['blockquote', 'code-block'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), [imageHandler]);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'indent',
    'align',
    'link', 'image',
    'blockquote', 'code-block'
  ];

  return (
    <div className="rich-text-editor">
      {/* Custom Toolbar Buttons */}
      <div className="flex items-center gap-2 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={handleInsertLink}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border rounded-lg hover:bg-gray-50 transition-colors"
          title="Холбоос нэмэх"
        >
          <LinkIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Холбоос</span>
        </button>
        <button
          type="button"
          onClick={() => { setUploadType('image'); setShowUploadModal(true); setUploadError(null); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border rounded-lg hover:bg-gray-50 transition-colors"
          title="Зураг оруулах"
        >
          <ImageIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Зураг</span>
        </button>
        <button
          type="button"
          onClick={() => { setUploadType('file'); setShowUploadModal(true); setUploadError(null); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border rounded-lg hover:bg-gray-50 transition-colors"
          title="PDF/Файл оруулах"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">PDF/Файл</span>
        </button>
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={editorValue}
        onChange={(html) => onChange(normalizeHtmlForStorage(html))}
        className="h-[350px] mb-12"
        modules={modules}
        formats={formats}
      />

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {uploadType === 'image' ? 'Зураг оруулах' : 'Файл оруулах'}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept={uploadType === 'image' ? 'image/*' : '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'}
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  {uploading ? (
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                  ) : (
                    <Upload className="w-12 h-12 text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {uploading ? 'Оруулж байна...' : 'Файл сонгох'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadType === 'image' 
                        ? 'JPG, PNG, GIF, WebP (5MB хүртэл)'
                        : 'PDF, Word, Excel, PowerPoint (10MB хүртэл)'
                      }
                    </p>
                  </div>
                </label>
              </div>

              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {uploadError}
                </div>
              )}

              {uploadType === 'image' && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Эсвэл URL оруулах:</p>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                      id="image-url-input"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('image-url-input') as HTMLInputElement;
                        const url = input?.value;
                        if (url) {
                          const quill = quillRef.current?.getEditor();
                          if (quill) {
                            const range = quill.getSelection(true);
                            quill.insertEmbed(range.index, 'image', url);
                            quill.setSelection(range.index + 1);
                          }
                          setShowUploadModal(false);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                    >
                      Оруулах
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: #e5e7eb;
          background: #f9fafb;
        }
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: #e5e7eb;
          font-size: 1rem;
        }
        .rich-text-editor .ql-editor {
          min-height: 300px;
        }
        /* Keep embeds compact inside the editor (global .ql-video is used for website viewing) */
        .rich-text-editor .ql-editor iframe.ql-video {
          width: 100%;
          height: 260px;
          min-height: 260px;
          max-height: 360px;
          border: 0;
          border-radius: 0.75rem;
          background: #fff;
        }
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
        }
        .rich-text-editor .ql-snow .ql-tooltip {
          z-index: 1000;
        }
      `}</style>
    </div>
  );
}
