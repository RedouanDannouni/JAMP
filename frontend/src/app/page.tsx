'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Target, Brain, Users } from 'lucide-react'
import { supabase, LearningGoal } from '@/lib/supabase'
import LearningGoalCard from '@/components/LearningGoalCard'
import AddGoalForm from '@/components/AddGoalForm'

export default function Home() {
  const [goals, setGoals] = useState<LearningGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('learning_goals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGoals(data || [])
    } catch (error) {
      console.error('Error fetching goals:', error)
      setError('Kon leerdoelen niet laden. Zorg ervoor dat de database is geconfigureerd.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddGoal = async (title: string, description: string) => {
    const { data, error } = await supabase
      .from('learning_goals')
      .insert([{ title, description }])
      .select()
      .single()

    if (error) throw error
    setGoals([data, ...goals])
  }

  const handleUpdateGoal = async (id: string, updates: Partial<LearningGoal>) => {
    const { data, error } = await supabase
      .from('learning_goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setGoals(goals.map(goal => goal.id === id ? data : goal))
  }

  const handleDeleteGoal = async (id: string) => {
    const { error } = await supabase
      .from('learning_goals')
      .delete()
      .eq('id', id)

    if (error) throw error
    setGoals(goals.filter(goal => goal.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI-Platform</h1>
                <p className="text-gray-600">Johan de Witt Scholengroep</p>
              </div>
            </div>
            <nav className="flex gap-4">
              <a href="/" className="text-blue-600 font-medium">Dashboard</a>
              <a href="/monitoring" className="text-gray-600 hover:text-blue-600 font-medium">Monitoring</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Totaal Leerdoelen</p>
                <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Actieve Vakken</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Docenten</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">AI Validaties</p>
                <p className="text-2xl font-bold text-gray-900">128</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Centrale Leerdoelendatabase</h2>
            {!error && (
              <div className="text-sm text-gray-500">
                {isLoading ? 'Laden...' : `${goals.length} leerdoelen`}
              </div>
            )}
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Database niet geconfigureerd</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                  <p className="text-red-600 mt-2 text-sm">
                    Klik op "Connect to Supabase" rechtsboven om de database in te stellen.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <AddGoalForm onAdd={handleAddGoal} />
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : goals.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nog geen leerdoelen</h3>
                  <p className="text-gray-500">Voeg je eerste leerdoel toe om te beginnen.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goals.map((goal) => (
                    <LearningGoalCard
                      key={goal.id}
                      goal={goal}
                      onUpdate={handleUpdateGoal}
                      onDelete={handleDeleteGoal}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}