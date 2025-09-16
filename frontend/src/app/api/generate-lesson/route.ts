import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { learningGoal } = await request.json();
    const startTime = Date.now();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock lesson generation
    const mockLesson = {
      lessonTitle: `Les: ${learningGoal.title}`,
      lessonOutline: `
**Leerdoel:** ${learningGoal.title}

**Tijdsduur:** 50 minuten

**Lesopbouw:**

1. **Introductie (10 min)**
   - Welkom en agenda
   - Activeren voorkennis
   - Uitleg leerdoel

2. **Instructie (15 min)**
   - Theoretische uitleg
   - Voorbeelden en demonstraties
   - Interactieve vragen

3. **Verwerking (20 min)**
   - Praktische oefeningen
   - Samenwerking in groepjes
   - Begeleiding door docent

4. **Afsluiting (5 min)**
   - Samenvatting hoofdpunten
   - Evaluatie leerdoel
   - Preview volgende les

**Benodigdheden:**
- Whiteboard/smartboard
- Werkbladen
- Eventueel digitale hulpmiddelen

**Differentiatie:**
- Extra uitdaging voor snelle leerlingen
- Ondersteuning voor leerlingen die meer tijd nodig hebben
      `,
      activities: [
        "Brainstorm activiteit: Leerlingen delen hun voorkennis over het onderwerp in tweetallen",
        "Interactieve presentatie met vragen en antwoorden om de theorie uit te leggen",
        "Praktische oefening waarbij leerlingen in groepjes van 3-4 aan de slag gaan met het geleerde",
        "Reflectie ronde waarin elke groep hun bevindingen deelt met de klas"
      ]
    };

    // Log the generation
    await supabase.from('logs').insert([{
      goal_id: learningGoal.id,
      timestamp: new Date().toISOString(),
      status: 'success',
      raw_output: JSON.stringify(mockLesson)
    }]);

    return NextResponse.json(mockLesson);
  } catch (error) {
    console.error('Error generating lesson:', error);
    
    // Log the error
    try {
      const { learningGoal } = await request.json();
      await supabase.from('logs').insert([{
        goal_id: learningGoal.id,
        timestamp: new Date().toISOString(),
        status: 'failed',
        raw_output: error instanceof Error ? error.message : 'Unknown error'
      }]);
    } catch (logError) {
      console.error('Error logging failure:', logError);
    }
    
    return NextResponse.json(
      { error: 'Fout bij het genereren van de les' },
      { status: 500 }
    );
  }
}