'use client'

import { useState } from 'react'
import { Pencil, Trash2, Save, X } from 'lucide-react'
import { LearningGoal } from '@/lib/supabase'

interface LearningGoalCardProps {
  goal: LearningGoal
  onUpdate: (id: string, updates: Partial<LearningGoal>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function LearningGoalCard({ goal, onUpdate, onDelete }: LearningGoalCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(goal.title)
  const [description, setDescription] = useState(goal.description || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) return
    
    setIsLoading(true)
    try {
      await onUpdate(goal.id, { title, description })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating goal:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setTitle(goal.title)
    setDescription(goal.description || '')
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (confirm('Weet je zeker dat je dit leerdoel wilt verwijderen?')) {
      setIsLoading(true)
      try {
        await onDelete(goal.id)
      } catch (error) {
        console.error('Error deleting goal:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg font-semibold border-b-2 border-blue-500 focus:outline-none bg-transparent"
            placeholder="Titel van het leerdoel"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Beschrijving van het leerdoel"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading || !title.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              Opslaan
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Annuleren
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800 flex-1">{goal.title}</h3>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Bewerken"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                title="Verwijderen"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {goal.description && (
            <p className="text-gray-600 mb-4 leading-relaxed">{goal.description}</p>
          )}
          
          <div className="text-sm text-gray-400">
            Aangemaakt: {new Date(goal.created_at).toLocaleDateString('nl-NL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      )}
    </div>
  )
}