import { ContentSafetyClient, AzureKeyCredential } from '@azure/ai-content-safety'

const client = new ContentSafetyClient(
  process.env.AZURE_CONTENT_SAFETY_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_CONTENT_SAFETY_KEY!)
)

export interface ValidationResult {
  status: 'safe' | 'flagged'
  explanation: string
  confidence: number
  categories?: string[]
}

export interface LessonContent {
  lessonTitle: string
  lessonOutline: string
  activities: string[]
}

export async function validateContent(content: LessonContent): Promise<ValidationResult> {
  try {
    // First, perform local validation
    const localResult = performLocalValidation(content)
    if (localResult.status === 'flagged') {
      return localResult
    }

    // Then use Azure Content Safety
    const combinedText = `${content.lessonTitle}\n${content.lessonOutline}\n${content.activities.join('\n')}`
    
    const result = await client.analyzeText({
      text: combinedText,
      categories: ['Hate', 'SelfHarm', 'Sexual', 'Violence'],
      outputType: 'FourSeverityLevels'
    })

    // Check if any category has medium or high severity
    const flaggedCategories: string[] = []
    let maxSeverity = 0

    if (result.categoriesAnalysis) {
      for (const category of result.categoriesAnalysis) {
        if (category.severity >= 2) { // Medium or High severity
          flaggedCategories.push(category.category)
          maxSeverity = Math.max(maxSeverity, category.severity)
        }
      }
    }

    if (flaggedCategories.length > 0) {
      return {
        status: 'flagged',
        explanation: `Azure Content Safety heeft ongepaste inhoud gedetecteerd in categorieën: ${flaggedCategories.join(', ')}`,
        confidence: 0.95,
        categories: flaggedCategories
      }
    }

    return {
      status: 'safe',
      explanation: 'Inhoud is goedgekeurd door Azure Content Safety en lokale validatie',
      confidence: 0.95
    }

  } catch (error) {
    console.error('Error during Azure Content Safety validation:', error)
    
    // Fallback to local validation if Azure service fails
    const localResult = performLocalValidation(content)
    return {
      ...localResult,
      explanation: `Azure Content Safety niet beschikbaar, lokale validatie gebruikt: ${localResult.explanation}`
    }
  }
}

function performLocalValidation(content: LessonContent): ValidationResult {
  const combinedText = `${content.lessonTitle} ${content.lessonOutline} ${content.activities.join(' ')}`
  
  // Check for inappropriate keywords in Dutch
  const inappropriateKeywords = [
    'geweld', 'drugs', 'alcohol', 'discriminatie', 'pesten', 'mobbing',
    'seks', 'pornografie', 'zelfmoord', 'zelfbeschadiging', 'haat'
  ]

  const lowercaseText = combinedText.toLowerCase()
  const foundKeywords = inappropriateKeywords.filter(keyword => 
    lowercaseText.includes(keyword)
  )

  if (foundKeywords.length > 0) {
    return {
      status: 'flagged',
      explanation: `Ongepaste inhoud gedetecteerd: ${foundKeywords.join(', ')}`,
      confidence: 0.9,
      categories: foundKeywords
    }
  }

  // Check for educational appropriateness
  const educationalKeywords = [
    'leren', 'onderwijs', 'school', 'student', 'leerling', 'docent',
    'les', 'activiteit', 'oefening', 'kennis', 'vaardigheid'
  ]

  const hasEducationalContent = educationalKeywords.some(keyword =>
    lowercaseText.includes(keyword)
  )

  if (!hasEducationalContent) {
    return {
      status: 'flagged',
      explanation: 'Inhoud lijkt niet educatief van aard te zijn',
      confidence: 0.7
    }
  }

  return {
    status: 'safe',
    explanation: 'Inhoud is geschikt voor educatief gebruik',
    confidence: 0.8
  }
}