import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { validateContent } from '@/lib/azure-content-safety';

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

    const { content, goalId } = await request.json();

    if (!content || !content.lessonTitle) {
      return NextResponse.json(
        { error: 'Ongeldige inhoud' },
        { status: 400 }
      );
    }

    // Validate content using Azure Content Safety
    const validationResult = await validateContent(content);

    if (validationResult.status === 'flagged') {
      // Log flagged content
      if (goalId) {
        await supabase.from('logs').insert([{
          goal_id: goalId,
          timestamp: new Date().toISOString(),
          status: 'flagged',
          raw_output: `Flagged: ${validationResult.explanation}`
        }]);
      }
    }

    return NextResponse.json(validationResult);

  } catch (error) {
    console.error('Error validating content:', error);
    return NextResponse.json(
      { 
        status: 'flagged',
        explanation: 'Fout tijdens validatie - inhoud geblokkeerd uit voorzorg',
        confidence: 0.5
      },
      { status: 500 }
    );
  }
}