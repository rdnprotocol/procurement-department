import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { Container } from "@/components/assets";

interface MissionContent {
  id: number;
  title: string;
  content: string;
  type: 'mission' | 'vision' | 'goal';
  created_at: string;
}

export const revalidate = 3600; // 1 цаг тутамд revalidate хийнэ

export default async function MissionPage() {
  const supabase = createSupabaseServerClient();

  const { data: contents } = await supabase
    .from('static_contents')
    .select('*')
    .in('type', ['mission', 'vision', 'goal'])
    .order('created_at', { ascending: true });

  const missionContent = contents?.find(c => c.type === 'mission');
  const visionContent = contents?.find(c => c.type === 'vision');
  const goalContent = contents?.find(c => c.type === 'goal');

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8 space-y-12">
        {/* Эрхэм зорилго */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {missionContent?.title || "Эрхэм зорилго"}
          </h2>
          <div className="prose max-w-none" 
            dangerouslySetInnerHTML={{ 
              __html: missionContent?.content || "Эрхэм зорилго оруулаагүй байна" 
            }} 
          />
        </section>

        {/* Алсын харалт */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {visionContent?.title || "Алсын харалт"}
          </h2>
          <div className="prose max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: visionContent?.content || "Алсын харалт оруулаагүй байна" 
            }}
          />
        </section>

        {/* Зорилтууд */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {goalContent?.title || "Стратегийн зорилтууд"}
          </h2>
          <div className="prose max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: goalContent?.content || "Зорилтууд оруулаагүй байна" 
            }}
          />
        </section>
      </div>
    </Container>
  );
}
