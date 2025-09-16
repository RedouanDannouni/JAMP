import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': '2024-02-15-preview' },
  defaultHeaders: {
    'api-key': process.env.AZURE_OPENAI_API_KEY,
  },
})

export interface LessonGenerationRequest {
  learningGoal: {
    id: string
    title: string
    description: string
  }
}

export interface LessonOutput {
  lessonTitle: string
  lessonOutline: string
  activities: string[]
}

export async function generateLesson(request: LessonGenerationRequest): Promise<LessonOutput> {
  const { learningGoal } = request

  // Educational content validation
  const educationKeywords = [
    'leren', 'onderwijs', 'school', 'student', 'leerling', 'docent', 'les',
    'curriculum', 'vaardigheid', 'kennis', 'competentie', 'educatie'
  ]

  const combinedContent = `${learningGoal.title} ${learningGoal.description}`.toLowerCase()
  const isEducational = educationKeywords.some(keyword => combinedContent.includes(keyword))

  if (!isEducational) {
    throw new Error('Het leerdoel is niet gerelateerd aan onderwijs.')
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
`

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
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
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('Geen response ontvangen van AI model')
    }

    const lessonData: LessonOutput = JSON.parse(content)

    // Validate required fields
    if (!lessonData.lessonTitle || !lessonData.lessonOutline || !lessonData.activities) {
      throw new Error('Onvolledige response van AI model')
    }

    return lessonData
  } catch (error) {
    console.error('Error generating lesson:', error)
    throw new Error(error instanceof Error ? error.message : 'Onbekende fout bij het genereren van de les')
  }
}