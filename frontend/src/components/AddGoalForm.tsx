'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

interface AddGoalFormProps {
  onAdd: (title: string, description: string) => Promise<void>
}

export default function AddGoalForm({ onAdd }: AddGoalFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      await onAdd(title, description)
      setTitle('')
      setDescription('')
      setIsOpen(false)
    } catch (error) {
      console.error('Error adding goal:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
      >
        <div className="flex items-center justify-center gap-2 text-gray-500 group-hover:text-blue-600">
          <Plus className="w-6 h-6" />
          <span className="text-lg font-medium">Nieuw leerdoel toevoegen</span>
        </div>
      </button>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-500">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Titel *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Bijv. Begrijpen van wiskundige concepten"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Beschrijving
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Uitgebreide beschrijving van het leerdoel..."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isLoading ? 'Toevoegen...' : 'Leerdoel toevoegen'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            Annuleren
          </button>
        </div>
      </form>
    </div>
  )
}