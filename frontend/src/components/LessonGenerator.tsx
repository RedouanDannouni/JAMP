import React, { useState } from 'react';
import { Wand2, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

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

interface ValidationResult {
  status: 'safe' | 'flagged';
  explanation: string;
  confidence: number;
}

interface LessonGeneratorProps {
  learningGoal: LearningGoal;
  onClose: () => void;
}

const LessonGenerator: React.FC<LessonGeneratorProps> = ({ learningGoal, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<LessonOutput | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editableLesson, setEditableLesson] = useState<LessonOutput | null>(null);

  const generateLesson = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedLesson(null);
    setValidationResult(null);

    try {
      // Call lesson generator API
      const generateResponse = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ learningGoal }),
      });

      if (!generateResponse.ok) {
        throw new Error('Fout bij het genereren van de les');
      }

      const lessonData: LessonOutput = await generateResponse.json();
      setGeneratedLesson(lessonData);
      setEditableLesson({ ...lessonData });

      // Validate the generated content
      const validateResponse = await fetch('/api/validate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: lessonData, goalId: learningGoal.id }),
      });

      if (!validateResponse.ok) {
        throw new Error('Fout bij het valideren van de inhoud');
      }

      const validation: ValidationResult = await validateResponse.json();
      setValidationResult(validation);

      if (validation.status === 'flagged') {
        setError(`Inhoud geblokkeerd: ${validation.explanation}`);
        setGeneratedLesson(null);
        setEditableLesson(null);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout opgetreden');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLessonEdit = (field: keyof LessonOutput, value: string | string[]) => {
    if (editableLesson) {
      setEditableLesson({
        ...editableLesson,
        [field]: value
      });
    }
  };

  const handleActivityEdit = (index: number, value: string) => {
    if (editableLesson) {
      const newActivities = [...editableLesson.activities];
      newActivities[index] = value;
      setEditableLesson({
        ...editableLesson,
        activities: newActivities
      });
    }
  };

  const addActivity = () => {
    if (editableLesson) {
      setEditableLesson({
        ...editableLesson,
        activities: [...editableLesson.activities, 'Nieuwe activiteit...']
      });
    }
  };

  const removeActivity = (index: number) => {
    if (editableLesson) {
      const newActivities = editableLesson.activities.filter((_, i) => i !== index);
      setEditableLesson({
        ...editableLesson,
        activities: newActivities
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Wand2 className="w-6 h-6 mr-2 text-blue-600" />
                Les Generator
              </h2>
              <p className="text-gray-600 mt-1">
                Genereer een les voor: <span className="font-semibold">{learningGoal.title}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {!generatedLesson && !isGenerating && (
            <div className="text-center py-8">
              <Wand2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Klaar om een les te genereren
              </h3>
              <p className="text-gray-600 mb-6">
                Klik op de knop hieronder om AI een les te laten genereren gebaseerd op het leerdoel.
              </p>
              <button
                onClick={generateLesson}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Genereer Les
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Les wordt gegenereerd...
              </h3>
              <p className="text-gray-600">
                Dit kan even duren. De AI ontwikkelt een complete les voor je.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800 font-semibold">Fout</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {validationResult && validationResult.status === 'safe' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-semibold">Inhoud Goedgekeurd</span>
              </div>
              <p className="text-green-700 mt-1">{validationResult.explanation}</p>
            </div>
          )}

          {editableLesson && validationResult?.status === 'safe' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Les Titel
                </label>
                <input
                  type="text"
                  value={editableLesson.lessonTitle}
                  onChange={(e) => handleLessonEdit('lessonTitle', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Les Opbouw
                </label>
                <textarea
                  value={editableLesson.lessonOutline}
                  onChange={(e) => handleLessonEdit('lessonOutline', e.target.value)}
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Activiteiten
                  </label>
                  <button
                    onClick={addActivity}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    + Activiteit Toevoegen
                  </button>
                </div>
                <div className="space-y-3">
                  {editableLesson.activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-sm text-gray-500 mt-3 min-w-[2rem]">
                        {index + 1}.
                      </span>
                      <textarea
                        value={activity}
                        onChange={(e) => handleActivityEdit(index, e.target.value)}
                        rows={2}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {editableLesson.activities.length > 1 && (
                        <button
                          onClick={() => removeActivity(index)}
                          className="text-red-600 hover:text-red-700 mt-3"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Sluiten
                </button>
                <button
                  onClick={generateLesson}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Nieuwe Les Genereren
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonGenerator;