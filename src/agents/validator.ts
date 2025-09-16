interface ValidationResult {
  status: 'safe' | 'flagged';
  explanation: string;
  confidence: number;
}

interface LessonContent {
  lessonTitle: string;
  lessonOutline: string;
  activities: string[];
}

class ContentValidator {
  private readonly azureContentSafetyEndpoint: string;
  private readonly azureContentSafetyKey: string;

  constructor() {
    this.azureContentSafetyEndpoint = process.env.AZURE_CONTENT_SAFETY_ENDPOINT || '';
    this.azureContentSafetyKey = process.env.AZURE_CONTENT_SAFETY_KEY || '';
  }

  private async callAzureContentSafety(text: string): Promise<any> {
    try {
      const response = await fetch(`${this.azureContentSafetyEndpoint}/contentsafety/text:analyze?api-version=2023-10-01`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': this.azureContentSafetyKey
        },
        body: JSON.stringify({
          text: text,
          categories: ['Hate', 'SelfHarm', 'Sexual', 'Violence'],
          blocklistNames: [],
          haltOnBlocklistHit: false,
          outputType: 'FourSeverityLevels'
        })
      });

      if (!response.ok) {
        throw new Error(`Azure Content Safety API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling Azure Content Safety:', error);
      throw error;
    }
  }

  private performLocalValidation(content: LessonContent): ValidationResult {
    const combinedText = `${content.lessonTitle} ${content.lessonOutline} ${content.activities.join(' ')}`;
    
    // Check for inappropriate keywords in Dutch
    const inappropriateKeywords = [
      'geweld', 'drugs', 'alcohol', 'discriminatie', 'pesten', 'mobbing',
      'seks', 'pornografie', 'zelfmoord', 'zelfbeschadiging', 'haat'
    ];

    const lowercaseText = combinedText.toLowerCase();
    const foundKeywords = inappropriateKeywords.filter(keyword => 
      lowercaseText.includes(keyword)
    );

    if (foundKeywords.length > 0) {
      return {
        status: 'flagged',
        explanation: `Ongepaste inhoud gedetecteerd: ${foundKeywords.join(', ')}`,
        confidence: 0.9
      };
    }

    // Check for educational appropriateness
    const educationalKeywords = [
      'leren', 'onderwijs', 'school', 'student', 'leerling', 'docent',
      'les', 'activiteit', 'oefening', 'kennis', 'vaardigheid'
    ];

    const hasEducationalContent = educationalKeywords.some(keyword =>
      lowercaseText.includes(keyword)
    );

    if (!hasEducationalContent) {
      return {
        status: 'flagged',
        explanation: 'Inhoud lijkt niet educatief van aard te zijn',
        confidence: 0.7
      };
    }

    return {
      status: 'safe',
      explanation: 'Inhoud is geschikt voor educatief gebruik',
      confidence: 0.8
    };
  }

  async validateContent(content: LessonContent): Promise<ValidationResult> {
    try {
      // First, perform local validation
      const localResult = this.performLocalValidation(content);
      
      if (localResult.status === 'flagged') {
        return localResult;
      }

      // If Azure Content Safety is configured, use it for additional validation
      if (this.azureContentSafetyEndpoint && this.azureContentSafetyKey) {
        try {
          const combinedText = `${content.lessonTitle}\n${content.lessonOutline}\n${content.activities.join('\n')}`;
          const azureResult = await this.callAzureContentSafety(combinedText);

          // Check if any category has high severity
          const categories = azureResult.categoriesAnalysis || [];
          const highSeverityFound = categories.some((category: any) => 
            category.severity >= 2 // Severity levels: 0=Safe, 1=Low, 2=Medium, 3=High
          );

          if (highSeverityFound) {
            const flaggedCategories = categories
              .filter((cat: any) => cat.severity >= 2)
              .map((cat: any) => cat.category)
              .join(', ');

            return {
              status: 'flagged',
              explanation: `Azure Content Safety heeft ongepaste inhoud gedetecteerd in categorieën: ${flaggedCategories}`,
              confidence: 0.95
            };
          }

          return {
            status: 'safe',
            explanation: 'Inhoud is goedgekeurd door Azure Content Safety en lokale validatie',
            confidence: 0.95
          };

        } catch (azureError) {
          console.warn('Azure Content Safety niet beschikbaar, gebruik lokale validatie:', azureError);
          return localResult;
        }
      }

      return localResult;

    } catch (error) {
      console.error('Error during content validation:', error);
      return {
        status: 'flagged',
        explanation: 'Fout tijdens validatie - inhoud geblokkeerd uit voorzorg',
        confidence: 0.5
      };
    }
  }

  async validateLesson(content: LessonContent): Promise<ValidationResult> {
    const result = await this.validateContent(content);
    
    // Log validation results for monitoring
    console.log('Content validation result:', {
      status: result.status,
      explanation: result.explanation,
      confidence: result.confidence,
      timestamp: new Date().toISOString()
    });

    return result;
  }
}

export default ContentValidator;
export type { ValidationResult, LessonContent };