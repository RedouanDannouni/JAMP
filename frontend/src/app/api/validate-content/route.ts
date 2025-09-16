import { NextRequest, NextResponse } from 'next/server';

// Mock implementation - replace with actual Azure Content Safety integration
export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation logic
    const combinedText = `${content.lessonTitle} ${content.lessonOutline} ${content.activities.join(' ')}`.toLowerCase();
    
    // Check for inappropriate content
    const inappropriateKeywords = [
      'geweld', 'drugs', 'alcohol', 'discriminatie', 'pesten', 'mobbing'
    ];

    const foundInappropriate = inappropriateKeywords.some(keyword => 
      combinedText.includes(keyword)
    );

    if (foundInappropriate) {
      return NextResponse.json({
        status: 'flagged',
        explanation: 'Ongepaste inhoud gedetecteerd door content filter',
        confidence: 0.9
      });
    }

    // Check if content is educational
    const educationalKeywords = [
      'les', 'leren', 'onderwijs', 'school', 'student', 'leerling', 'docent'
    ];

    const hasEducationalContent = educationalKeywords.some(keyword =>
      combinedText.includes(keyword)
    );

    if (!hasEducationalContent) {
      return NextResponse.json({
        status: 'flagged',
        explanation: 'Inhoud lijkt niet educatief van aard te zijn',
        confidence: 0.7
      });
    }

    return NextResponse.json({
      status: 'safe',
      explanation: 'Inhoud is goedgekeurd voor educatief gebruik',
      confidence: 0.95
    });

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