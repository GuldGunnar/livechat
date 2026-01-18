/**
 * Visitor Tracker Dashboard
 *
 * Main application with authentication and routing.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Settings } from './pages/Settings';
import { Statistics } from './pages/Statistics';
import { Documentation } from './pages/Documentation';

// Loading spinner
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Laddar...</p>
      </div>
    </div>
  );
}

// Login redirect to qrplan.eu
function LoginRedirect() {
  window.location.href = 'https://qrplan.eu/login.php?redirect=/dashboard/';
  return <LoadingScreen />;
}

// Footer
function Footer() {
  return (
    <footer className="py-4 text-center text-gray-400 text-sm border-t border-gray-200">
      Design - Hosting - Copyright &copy; {new Date().getFullYear()}{' '}
      <a
        href="https://www.nahe.se/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-gray-700 transition"
      >
        NAHE Consulting
      </a>
    </footer>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginRedirect />;
  }

  return <>{children}</>;
}

// Main layout
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// App routes
function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Projects />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Statistics />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/documentation"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Documentation />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter basename="/dashboard">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
