import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { generateLesson } from '@/lib/azure-openai';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Niet geautoriseerd' },
        { status: 401 }
      );
    }

    const { learningGoal } = await request.json();

    if (!learningGoal || !learningGoal.id || !learningGoal.title) {
      return NextResponse.json(
        { error: 'Ongeldig leerdoel' },
        { status: 400 }
      );
    }

    // Generate lesson using Azure OpenAI
    const lessonData = await generateLesson({ learningGoal });

    // Log the generation
    await supabase.from('logs').insert([{
      goal_id: learningGoal.id,
      timestamp: new Date().toISOString(),
      status: 'success',
      raw_output: JSON.stringify(lessonData)
    }]);

    return NextResponse.json(lessonData);
  } catch (error) {
    console.error('Error generating lesson:', error);
    
    // Log the error
    try {
      const { learningGoal } = await request.json();
      if (learningGoal?.id) {
        await supabase.from('logs').insert([{
          goal_id: learningGoal.id,
          timestamp: new Date().toISOString(),
          status: 'failed',
          raw_output: error instanceof Error ? error.message : 'Unknown error'
        }]);
      }
    } catch (logError) {
      console.error('Error logging failure:', logError);
    }
    
    return NextResponse.json(
      { error: 'Fout bij het genereren van de les' },
      { status: 500 }
    );
  }
}