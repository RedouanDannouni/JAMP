import { OpenAIApi, Configuration } from 'openai';

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface LessonOutput {
  lessonTitle: string;
  lessonOutline: string;
  activities: string[];
}

interface GenerationResult {
  success: boolean;
  data?: LessonOutput;
  error?: string;
}

class LessonGenerator {
  private openai: OpenAIApi;
  private readonly educationKeywords = [
    'leren', 'onderwijs', 'school', 'student', 'leerling', 'docent', 'les',
    'curriculum', 'vaardigheid', 'kennis', 'competentie', 'educatie'
  ];

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      basePath: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
      baseOptions: {
        headers: {
          'api-key': process.env.AZURE_OPENAI_API_KEY,
        },
        params: {
          'api-version': '2024-02-15-preview'
        }
      }
    });
    this.openai = new OpenAIApi(configuration);
  }

  private isEducationRelated(content: string): boolean {
    const lowercaseContent = content.toLowerCase();
    return this.educationKeywords.some(keyword => 
      lowercaseContent.includes(keyword)
    );
  }

  private validateEducationalContent(learningGoal: LearningGoal): boolean {
    const combinedContent = `${learningGoal.title} ${learningGoal.description}`;
    
    if (!this.isEducationRelated(combinedContent)) {
      return false;
    }

    // Additional checks for inappropriate content
    const inappropriateKeywords = [
      'geweld', 'drugs', 'alcohol', 'seks', 'discriminatie'
    ];
    
    const lowercaseContent = combinedContent.toLowerCase();
    return !inappropriateKeywords.some(keyword => 
      lowercaseContent.includes(keyword)
    );
  }

  async generateLesson(learningGoal: LearningGoal): Promise<GenerationResult> {
    try {
      // Guardrail: Check if content is education-related
      if (!this.validateEducationalContent(learningGoal)) {
        return {
          success: false,
          error: 'Het leerdoel is niet gerelateerd aan onderwijs of bevat ongepaste inhoud.'
        };
      }

      const prompt = `
Je bent een ervaren docent die lessen ontwikkelt voor Nederlandse scholen.

Leerdoel:
Titel: ${learningGoal.title}
Beschrijving: ${learningGoal.description}

Genereer een complete les gebaseerd op dit leerdoel. Geef je antwoord in het volgende JSON-formaat:

{
  "lessonTitle": "Titel van de les",
  "lessonOutline": "Gedetailleerde lesopbouw met tijdsindicaties en leerdoelen",
  "activities": [
    "Activiteit 1: Beschrijving van de eerste activiteit",
    "Activiteit 2: Beschrijving van de tweede activiteit",
    "Activiteit 3: Beschrijving van de derde activiteit"
  ]
}

Zorg ervoor dat:
- De les geschikt is voor het Nederlandse onderwijssysteem
- Activiteiten interactief en boeiend zijn
- De les duidelijke leerdoelen heeft
- Tijdsindicaties realistisch zijn
- De inhoud pedagogisch verantwoord is
`;

      const response = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Je bent een expert in het ontwikkelen van educatieve content voor Nederlandse scholen. Geef altijd antwoorden in correct JSON-formaat.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Geen response ontvangen van AI model');
      }

      // Parse JSON response
      const lessonData: LessonOutput = JSON.parse(content);

      // Validate required fields
      if (!lessonData.lessonTitle || !lessonData.lessonOutline || !lessonData.activities) {
        throw new Error('Onvolledige response van AI model');
      }

      return {
        success: true,
        data: lessonData
      };

    } catch (error) {
      console.error('Error generating lesson:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Onbekende fout bij het genereren van de les'
      };
    }
  }
}

export default LessonGenerator;
export type { LearningGoal, LessonOutput, GenerationResult };