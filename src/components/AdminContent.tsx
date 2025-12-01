'use client';

import { useEffect, useState } from 'react';
import { Container } from "@/components/assets";
import { EditStaticContent } from '@/components/EditStaticContent';
import CreateNewsForm from '@/components/CreateNewsForm';
import { AdminContentsTable } from "@/components";

interface StaticContent {
  id: number;
  title: string;
  content: string;
  type: string;
  updated_at: string;
}

interface User {
  email: string;
  id?: string;
  role?: string;
}

export function AdminContent() {
  const [user, setUser] = useState<User | null>(null);
  const [staticContents, setStaticContents] = useState<StaticContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch static contents
        const contentsResponse = await fetch('/api/static-content');
        if (!contentsResponse.ok) {
          throw new Error('Failed to fetch static contents');
        }
        const contentsData = await contentsResponse.json();
        setStaticContents(contentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <div className="py-8">
          <p>Loading...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Админ удирдлага</h1>
            <p className="text-gray-600">Тавтай морил!</p>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Статик контентууд */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Цэсний контентууд</h2>
            <div className="grid gap-6">
              {staticContents?.map((content) => (
                <EditStaticContent 
                  key={content.id} 
                  content={content} 
                />
              ))}
            </div>
          </div>

          {/* Мэдээний жагсаалт */}
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Мэдээний жагсаалт</h2>
              <CreateNewsForm />
            </div>
            <AdminContentsTable />
          </div>
        </div>
      </div>
    </Container>
  );
}