'use client'

import { signOut } from 'next-auth/react'
import { Brain, LogOut, User } from 'lucide-react'

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | undefined
}

export default function Header({ user }: HeaderProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
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
          
          <div className="flex items-center gap-6">
            <nav className="flex gap-4">
              <a href="/" className="text-blue-600 font-medium">Dashboard</a>
              <a href="/monitoring" className="text-gray-600 hover:text-blue-600 font-medium">Monitoring</a>
            </nav>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5" />
                <div className="text-sm">
                  <p className="font-medium">{user?.name || 'Gebruiker'}</p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Uitloggen"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Uitloggen</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}