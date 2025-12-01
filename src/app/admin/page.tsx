'use client';

import { useEffect, useState } from 'react';
import { Container } from "@/components/assets";
import { ContentCard } from "@/components/ContentCard";
import CreateNewsForm from '@/components/CreateNewsForm';
import { AdminContentsTable } from "@/components";
import { CreateStaticContent } from "@/components/CreateStaticContent";
import { FileText, Newspaper, Settings } from 'lucide-react';

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
  updated_at: string;
}

export default function AdminPage() {
  const [staticContents, setStaticContents] = useState<StaticContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/static-content');
      if (!response.ok) {
        throw new Error('Failed to fetch contents');
      }
      const data = await response.json();
      setStaticContents(data);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <div className="py-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Уншиж байна...</p>
          </div>
        </div>
      </Container>
    );
  }

  // Group contents by type for better organization
  const groupedContents = {
    mission: staticContents.find(c => c.type === 'mission'),
    vision: staticContents.find(c => c.type === 'vision'),
    goal: staticContents.find(c => c.type === 'goal'),
    history: staticContents.find(c => c.type === 'history'),
    structure: staticContents.find(c => c.type === 'structure'),
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mission':
      case 'vision':
      case 'goal':
        return <FileText className="w-5 h-5" />;
      case 'history':
        return <FileText className="w-5 h-5" />;
      case 'structure':
        return <Settings className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <Container>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Админ удирдлага</h1>
            <p className="text-gray-600">Статик мэдээлэл болон контентуудыг удирдах</p>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Статик контентууд */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-semibold">Статик мэдээлэл</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Байгууллагын танилцуулга, эрхэм зорилго, алсын харалт, стратегийн зорилтууд зэрэг статик мэдээллийг засах
                  </p>
                </div>
              </div>
              <CreateStaticContent onSuccess={fetchContents} />
            </div>
            <div className="grid gap-6">
              {staticContents && staticContents.length > 0 ? (
                staticContents.map((content) => (
                  <ContentCard 
                    key={content.id} 
                    content={content}
                    onUpdate={fetchContents}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Статик контент олдсонгүй. Шинэ контент нэмэх товч дараад нэмнэ үү.
                </div>
              )}
            </div>
          </div>

          {/* Мэдээний жагсаалт */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Newspaper className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">Мэдээний жагсаалт</h2>
              </div>
              <CreateNewsForm />
            </div>
            <p className="text-gray-600 mb-6">
              Мэдээ, мэдээлэл, тендер зарлал зэрэг контентуудыг удирдах
            </p>
            <AdminContentsTable />
          </div>
        </div>
      </div>
    </Container>
  );
}
