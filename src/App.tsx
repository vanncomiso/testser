import React from 'react';
import { useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/components/protected-route';
import LandingPage from '../components/LandingPage';
import DashboardPage from '../app/dashboard/page';
import { Button } from '@/components/ui/button';

function App() {
  const [showLanding, setShowLanding] = useState(true);

  if (showLanding) {
    return (
      <div className="relative">
        <LandingPage />
        {/* Dashboard Access Button */}
        <div className="fixed top-4 right-4 z-[100]">
          <Button
            onClick={() => setShowLanding(false)}
            className="bg-violet-300 hover:bg-violet-400 text-white font-medium px-4 py-2 rounded-lg shadow-lg"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-sidebar overflow-hidden">
      <ThemeProvider defaultTheme="dark" attribute="class">
        <AuthProvider>
          <ProtectedRoute>
            <div className="relative">
              <DashboardPage />
              {/* Back to Landing Button */}
              <div className="fixed bottom-4 right-4 z-[100]">
                <Button
                  onClick={() => setShowLanding(true)}
                  variant="outline"
                  className="bg-white/90 hover:bg-white text-black font-medium px-4 py-2 rounded-lg shadow-lg"
                >
                  Back to Landing
                </Button>
              </div>
            </div>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;