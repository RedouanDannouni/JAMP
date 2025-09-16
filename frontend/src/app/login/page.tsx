import React from 'react';
import { LogIn, Shield, Users, BookOpen } from 'lucide-react';

export default function LoginPage() {
  const handleLogin = () => {
    // In production, this would redirect to Azure AD
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Platform</h1>
          <p className="text-gray-600">Johan de Witt Scholengroep</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welkom Terug</h2>
            <p className="text-gray-600">Log in met je school account</p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-gray-700">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Veilige Azure AD authenticatie</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Users className="w-5 h-5 text-green-600" />
              <span>Toegang voor alle docenten</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>AI-gedreven lesgeneratie</span>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <LogIn className="w-5 h-5" />
            Inloggen met Azure AD
          </button>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Alleen voor medewerkers van Johan de Witt Scholengroep</p>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Problemen met inloggen? Neem contact op met IT-support</p>
        </div>
      </div>
    </div>
  );
}